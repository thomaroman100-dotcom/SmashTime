create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text not null,
  slug text not null unique,
  profile_type text not null default 'fighter' check (profile_type in ('fighter', 'staff')),
  status text not null default 'pending' check (status in ('pending', 'active', 'suspended')),
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.fighter_profiles (
  user_id uuid primary key references public.profiles(user_id) on delete cascade,
  nickname text,
  weight_class text,
  record text,
  origin text,
  image_path text,
  public_bio text,
  is_verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.staff_permissions (
  user_id uuid not null references public.profiles(user_id) on delete cascade,
  permission text not null check (
    permission in (
      'users.manage',
      'fighters.manage',
      'champions.manage',
      'events.manage',
      'fightcards.manage',
      'news.manage',
      'sponsors.manage',
      'contact.manage',
      'media.manage',
      'settings.manage'
    )
  ),
  created_at timestamptz not null default now(),
  primary key (user_id, permission)
);

alter table public.champions
  add column if not exists fighter_user_id uuid references public.fighter_profiles(user_id) on delete set null;

alter table public.fight_cards
  add column if not exists fighter_a_user_id uuid references public.fighter_profiles(user_id) on delete set null,
  add column if not exists fighter_b_user_id uuid references public.fighter_profiles(user_id) on delete set null;

create index if not exists profiles_type_status_idx on public.profiles(profile_type, status);
create index if not exists fighter_profiles_verified_idx on public.fighter_profiles(is_verified);
create index if not exists staff_permissions_permission_idx on public.staff_permissions(permission);
create index if not exists champions_fighter_user_id_idx on public.champions(fighter_user_id);
create index if not exists fight_cards_fighter_a_user_id_idx on public.fight_cards(fighter_a_user_id);
create index if not exists fight_cards_fighter_b_user_id_idx on public.fight_cards(fighter_b_user_id);

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists set_fighter_profiles_updated_at on public.fighter_profiles;
create trigger set_fighter_profiles_updated_at
before update on public.fighter_profiles
for each row execute function public.set_updated_at();

create or replace function private.member_slug(display_name text, user_id uuid)
returns text
language sql
stable
as $$
  select trim(both '-' from regexp_replace(lower(coalesce(display_name, 'mitglied')), '[^a-z0-9]+', '-', 'g'))
    || '-' || left(user_id::text, 8);
$$;

create or replace function private.create_profile_for_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  requested_type text;
  safe_display_name text;
begin
  requested_type := coalesce(new.raw_user_meta_data ->> 'profile_type', 'fighter');
  if requested_type not in ('fighter', 'staff') then
    requested_type := 'fighter';
  end if;

  safe_display_name := nullif(trim(coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1))), '');
  if safe_display_name is null then
    safe_display_name := 'SmashTime Mitglied';
  end if;

  insert into public.profiles (user_id, email, display_name, slug, profile_type, status)
  values (
    new.id,
    new.email,
    safe_display_name,
    private.member_slug(safe_display_name, new.id),
    requested_type,
    'pending'
  )
  on conflict (user_id) do nothing;

  if requested_type = 'fighter' then
    insert into public.fighter_profiles (user_id)
    values (new.id)
    on conflict (user_id) do nothing;
  end if;

  return new;
end;
$$;

drop trigger if exists create_profile_for_new_user on auth.users;
create trigger create_profile_for_new_user
after insert on auth.users
for each row execute function private.create_profile_for_new_user();

insert into public.profiles (user_id, email, display_name, slug, profile_type, status, created_at, updated_at)
select
  admin_profiles.user_id,
  auth_users.email,
  coalesce(nullif(trim(admin_profiles.display_name), ''), auth_users.email, 'SmashTime Admin'),
  private.member_slug(coalesce(nullif(trim(admin_profiles.display_name), ''), auth_users.email, 'SmashTime Admin'), admin_profiles.user_id),
  'staff',
  case when admin_profiles.is_active then 'active' else 'suspended' end,
  admin_profiles.created_at,
  admin_profiles.updated_at
from public.admin_profiles
left join auth.users auth_users on auth_users.id = admin_profiles.user_id
on conflict (user_id) do update set
  email = excluded.email,
  display_name = excluded.display_name,
  profile_type = 'staff',
  status = excluded.status,
  updated_at = now();

insert into public.staff_permissions (user_id, permission)
select admin_profiles.user_id, permissions.permission
from public.admin_profiles
cross join (
  values
    ('champions.manage'),
    ('events.manage'),
    ('fightcards.manage'),
    ('news.manage'),
    ('sponsors.manage'),
    ('contact.manage'),
    ('media.manage')
) as permissions(permission)
where admin_profiles.is_active = true
  and admin_profiles.role = 'editor'
on conflict do nothing;

create or replace function private.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_profiles
    where user_id = (select auth.uid())
      and is_active = true
      and role = 'admin'
  );
$$;

create or replace function private.has_permission(requested_permission text)
returns boolean
language sql
security definer
set search_path = public
as $$
  select private.is_admin()
    or exists (
      select 1
      from public.profiles
      where profiles.user_id = (select auth.uid())
        and profiles.profile_type = 'staff'
        and profiles.status = 'active'
        and (
          (
            requested_permission = 'admin.access'
            and exists (
              select 1
              from public.staff_permissions
              where staff_permissions.user_id = profiles.user_id
            )
          )
          or exists (
            select 1
            from public.staff_permissions
            where staff_permissions.user_id = profiles.user_id
              and staff_permissions.permission = requested_permission
          )
        )
    );
$$;

create or replace function private.is_active_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select private.has_permission('admin.access');
$$;

revoke all on function private.member_slug(text, uuid) from public, anon, authenticated;
revoke all on function private.create_profile_for_new_user() from public, anon, authenticated;
revoke all on function private.is_admin() from public, anon, authenticated;
revoke all on function private.has_permission(text) from public, anon, authenticated;
revoke all on function private.is_active_admin() from public, anon, authenticated;
grant execute on function private.is_admin() to authenticated;
grant execute on function private.has_permission(text) to authenticated;
grant execute on function private.is_active_admin() to authenticated;

alter table public.profiles enable row level security;
alter table public.fighter_profiles enable row level security;
alter table public.staff_permissions enable row level security;

grant select, insert, update, delete on public.profiles to authenticated;
grant select, insert, update, delete on public.fighter_profiles to authenticated;
grant select, insert, delete on public.staff_permissions to authenticated;

drop policy if exists "profile owner can read profile" on public.profiles;
create policy "profile owner can read profile"
on public.profiles for select
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "authorized staff can read member profiles" on public.profiles;
create policy "authorized staff can read member profiles"
on public.profiles for select
to authenticated
using (
  (select private.has_permission('users.manage'))
  or (select private.has_permission('fighters.manage'))
  or (select private.has_permission('champions.manage'))
  or (select private.has_permission('fightcards.manage'))
);

drop policy if exists "authorized staff manage member profiles" on public.profiles;
create policy "authorized staff manage member profiles"
on public.profiles for all
to authenticated
using ((select private.has_permission('users.manage')))
with check ((select private.has_permission('users.manage')));

drop policy if exists "profile owner can read fighter profile" on public.fighter_profiles;
create policy "profile owner can read fighter profile"
on public.fighter_profiles for select
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "authorized staff can read fighter profiles" on public.fighter_profiles;
create policy "authorized staff can read fighter profiles"
on public.fighter_profiles for select
to authenticated
using (
  (select private.has_permission('users.manage'))
  or (select private.has_permission('fighters.manage'))
  or (select private.has_permission('champions.manage'))
  or (select private.has_permission('fightcards.manage'))
);

drop policy if exists "authorized staff manage fighter profiles" on public.fighter_profiles;
create policy "authorized staff manage fighter profiles"
on public.fighter_profiles for all
to authenticated
using ((select private.has_permission('users.manage')) or (select private.has_permission('fighters.manage')))
with check ((select private.has_permission('users.manage')) or (select private.has_permission('fighters.manage')));

drop policy if exists "staff can read own permissions" on public.staff_permissions;
create policy "staff can read own permissions"
on public.staff_permissions for select
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "admins manage staff permissions" on public.staff_permissions;
create policy "admins manage staff permissions"
on public.staff_permissions for all
to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

drop policy if exists "active admins manage admin profiles" on public.admin_profiles;
drop policy if exists "admins manage admin profiles" on public.admin_profiles;
create policy "admins manage admin profiles"
on public.admin_profiles for all
to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

drop policy if exists "active admins manage champions" on public.champions;
drop policy if exists "staff manage champions" on public.champions;
create policy "staff manage champions"
on public.champions for all
to authenticated
using ((select private.has_permission('champions.manage')))
with check ((select private.has_permission('champions.manage')));

drop policy if exists "active admins manage events" on public.events;
drop policy if exists "staff manage events" on public.events;
create policy "staff manage events"
on public.events for all
to authenticated
using ((select private.has_permission('events.manage')))
with check ((select private.has_permission('events.manage')));

drop policy if exists "fightcard staff read events" on public.events;
create policy "fightcard staff read events"
on public.events for select
to authenticated
using ((select private.has_permission('fightcards.manage')));

drop policy if exists "settings staff read events" on public.events;
create policy "settings staff read events"
on public.events for select
to authenticated
using ((select private.has_permission('settings.manage')));

drop policy if exists "active admins manage fight cards" on public.fight_cards;
drop policy if exists "staff manage fight cards" on public.fight_cards;
create policy "staff manage fight cards"
on public.fight_cards for all
to authenticated
using ((select private.has_permission('fightcards.manage')))
with check ((select private.has_permission('fightcards.manage')));

drop policy if exists "active admins manage news" on public.news_posts;
drop policy if exists "staff manage news" on public.news_posts;
create policy "staff manage news"
on public.news_posts for all
to authenticated
using ((select private.has_permission('news.manage')))
with check ((select private.has_permission('news.manage')));

drop policy if exists "active admins manage sponsors" on public.sponsors;
drop policy if exists "staff manage sponsors" on public.sponsors;
create policy "staff manage sponsors"
on public.sponsors for all
to authenticated
using ((select private.has_permission('sponsors.manage')))
with check ((select private.has_permission('sponsors.manage')));

drop policy if exists "active admins manage contact requests" on public.contact_requests;
drop policy if exists "staff manage contact requests" on public.contact_requests;
create policy "staff manage contact requests"
on public.contact_requests for all
to authenticated
using ((select private.has_permission('contact.manage')))
with check ((select private.has_permission('contact.manage')));

drop policy if exists "active admins manage media" on public.media_assets;
drop policy if exists "staff manage media" on public.media_assets;
create policy "staff manage media"
on public.media_assets for all
to authenticated
using ((select private.has_permission('media.manage')))
with check ((select private.has_permission('media.manage')));

drop policy if exists "active admins manage settings" on public.site_settings;
drop policy if exists "staff manage settings" on public.site_settings;
create policy "staff manage settings"
on public.site_settings for all
to authenticated
using ((select private.has_permission('settings.manage')))
with check ((select private.has_permission('settings.manage')));

drop policy if exists "active admins manage event results" on public.event_results;
drop policy if exists "staff manage event results" on public.event_results;
create policy "staff manage event results"
on public.event_results for all
to authenticated
using ((select private.has_permission('events.manage')))
with check ((select private.has_permission('events.manage')));

drop policy if exists "active admins manage event gallery" on public.event_gallery;
drop policy if exists "staff manage event gallery" on public.event_gallery;
create policy "staff manage event gallery"
on public.event_gallery for all
to authenticated
using ((select private.has_permission('events.manage')) or (select private.has_permission('media.manage')))
with check ((select private.has_permission('events.manage')) or (select private.has_permission('media.manage')));

drop policy if exists "active admins upload smashtime media" on storage.objects;
drop policy if exists "staff upload smashtime media" on storage.objects;
create policy "staff upload smashtime media"
on storage.objects for insert
to authenticated
with check (bucket_id = 'smashtime-media' and (select private.has_permission('media.manage')));

drop policy if exists "active admins update smashtime media" on storage.objects;
drop policy if exists "staff update smashtime media" on storage.objects;
create policy "staff update smashtime media"
on storage.objects for update
to authenticated
using (bucket_id = 'smashtime-media' and (select private.has_permission('media.manage')))
with check (bucket_id = 'smashtime-media' and (select private.has_permission('media.manage')));

drop policy if exists "active admins delete smashtime media" on storage.objects;
drop policy if exists "staff delete smashtime media" on storage.objects;
create policy "staff delete smashtime media"
on storage.objects for delete
to authenticated
using (bucket_id = 'smashtime-media' and (select private.has_permission('media.manage')));
