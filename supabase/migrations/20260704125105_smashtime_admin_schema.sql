create schema if not exists private;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.admin_profiles (
  id bigint generated always as identity primary key,
  user_id uuid not null unique references auth.users(id) on delete cascade,
  role text not null default 'editor' check (role in ('admin', 'editor')),
  display_name text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.champions (
  id bigint generated always as identity primary key,
  slug text not null unique,
  name text not null,
  age text,
  weight text,
  weight_class text,
  record text,
  origin text,
  image_path text,
  stance text,
  bio text,
  quote text,
  title text,
  stats jsonb not null default '[]'::jsonb,
  last_fights jsonb not null default '[]'::jsonb,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.events (
  id bigint generated always as identity primary key,
  slug text not null unique,
  name text not null,
  short_name text not null,
  subtitle text,
  event_date timestamptz,
  date_label text,
  location text,
  address text,
  admission text,
  starts_at text,
  disciplines text[] not null default '{}'::text[],
  gastro text,
  image_path text,
  ticket_url text,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.fight_cards (
  id bigint generated always as identity primary key,
  event_id bigint not null references public.events(id) on delete cascade,
  sort_order integer not null default 0,
  label text,
  fighter_a text,
  fighter_b text,
  fighter_a_is_tba boolean not null default true,
  fighter_b_is_tba boolean not null default true,
  weight_class text,
  discipline text,
  is_main_event boolean not null default false,
  is_visible boolean not null default false,
  status text not null default 'planned' check (status in ('planned', 'confirmed', 'cancelled', 'completed')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.news_posts (
  id bigint generated always as identity primary key,
  slug text not null unique,
  title text not null,
  category text not null default 'Neuigkeit',
  excerpt text,
  body jsonb not null default '[]'::jsonb,
  image_path text,
  hero_image_path text,
  related_ids text[] not null default '{}'::text[],
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.sponsors (
  id bigint generated always as identity primary key,
  name text not null,
  logo_path text,
  website_url text,
  package_name text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.contact_requests (
  id bigint generated always as identity primary key,
  category text not null check (category in ('Sponsoring', 'Presse', 'Kämpfer', 'Allgemein')),
  name text not null,
  email text not null,
  subject text,
  message text not null,
  status text not null default 'neu' check (status in ('neu', 'gelesen', 'erledigt')),
  internal_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.media_assets (
  id bigint generated always as identity primary key,
  bucket text not null default 'smashtime-media',
  path text not null unique,
  asset_type text not null,
  alt_text text,
  usage_note text,
  is_public boolean not null default false,
  is_checked boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  id bigint generated always as identity primary key,
  key text not null unique,
  value jsonb not null default '{}'::jsonb,
  is_public boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.event_results (
  id bigint generated always as identity primary key,
  event_id bigint not null references public.events(id) on delete cascade,
  fight_card_id bigint references public.fight_cards(id) on delete set null,
  label text,
  fighter_a text,
  fighter_b text,
  winner text,
  method text,
  discipline text,
  sort_order integer not null default 0,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.event_gallery (
  id bigint generated always as identity primary key,
  event_id bigint not null references public.events(id) on delete cascade,
  media_asset_id bigint references public.media_assets(id) on delete set null,
  image_path text,
  alt_text text,
  sort_order integer not null default 0,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists admin_profiles_user_id_idx on public.admin_profiles(user_id);
create index if not exists champions_active_sort_idx on public.champions(is_active, sort_order);
create index if not exists events_status_date_idx on public.events(status, event_date);
create index if not exists fight_cards_event_id_idx on public.fight_cards(event_id);
create index if not exists news_posts_status_published_idx on public.news_posts(status, published_at);
create index if not exists sponsors_active_sort_idx on public.sponsors(is_active, sort_order);
create index if not exists contact_requests_status_created_idx on public.contact_requests(status, created_at);
create index if not exists media_assets_public_checked_idx on public.media_assets(is_public, is_checked);
create index if not exists event_results_event_id_idx on public.event_results(event_id);
create index if not exists event_gallery_event_id_idx on public.event_gallery(event_id);
create index if not exists event_gallery_media_asset_id_idx on public.event_gallery(media_asset_id);

drop trigger if exists set_admin_profiles_updated_at on public.admin_profiles;
create trigger set_admin_profiles_updated_at
before update on public.admin_profiles
for each row execute function public.set_updated_at();

drop trigger if exists set_champions_updated_at on public.champions;
create trigger set_champions_updated_at
before update on public.champions
for each row execute function public.set_updated_at();

drop trigger if exists set_events_updated_at on public.events;
create trigger set_events_updated_at
before update on public.events
for each row execute function public.set_updated_at();

drop trigger if exists set_fight_cards_updated_at on public.fight_cards;
create trigger set_fight_cards_updated_at
before update on public.fight_cards
for each row execute function public.set_updated_at();

drop trigger if exists set_news_posts_updated_at on public.news_posts;
create trigger set_news_posts_updated_at
before update on public.news_posts
for each row execute function public.set_updated_at();

drop trigger if exists set_sponsors_updated_at on public.sponsors;
create trigger set_sponsors_updated_at
before update on public.sponsors
for each row execute function public.set_updated_at();

drop trigger if exists set_contact_requests_updated_at on public.contact_requests;
create trigger set_contact_requests_updated_at
before update on public.contact_requests
for each row execute function public.set_updated_at();

drop trigger if exists set_media_assets_updated_at on public.media_assets;
create trigger set_media_assets_updated_at
before update on public.media_assets
for each row execute function public.set_updated_at();

drop trigger if exists set_site_settings_updated_at on public.site_settings;
create trigger set_site_settings_updated_at
before update on public.site_settings
for each row execute function public.set_updated_at();

drop trigger if exists set_event_results_updated_at on public.event_results;
create trigger set_event_results_updated_at
before update on public.event_results
for each row execute function public.set_updated_at();

drop trigger if exists set_event_gallery_updated_at on public.event_gallery;
create trigger set_event_gallery_updated_at
before update on public.event_gallery
for each row execute function public.set_updated_at();

create or replace function private.is_active_admin()
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
      and role in ('admin', 'editor')
  );
$$;

revoke all on schema private from public, anon, authenticated;
revoke execute on function private.is_active_admin() from public, anon, authenticated;
grant usage on schema private to authenticated;
grant execute on function private.is_active_admin() to authenticated;

alter table public.admin_profiles enable row level security;
alter table public.champions enable row level security;
alter table public.events enable row level security;
alter table public.fight_cards enable row level security;
alter table public.news_posts enable row level security;
alter table public.sponsors enable row level security;
alter table public.contact_requests enable row level security;
alter table public.media_assets enable row level security;
alter table public.site_settings enable row level security;
alter table public.event_results enable row level security;
alter table public.event_gallery enable row level security;

grant usage on schema public to anon, authenticated;

grant select on public.champions, public.events, public.fight_cards, public.news_posts, public.sponsors, public.media_assets, public.site_settings, public.event_results, public.event_gallery to anon;
grant insert on public.contact_requests to anon;
grant usage, select on sequence public.contact_requests_id_seq to anon;

grant select, insert, update, delete on
  public.admin_profiles,
  public.champions,
  public.events,
  public.fight_cards,
  public.news_posts,
  public.sponsors,
  public.contact_requests,
  public.media_assets,
  public.site_settings,
  public.event_results,
  public.event_gallery
to authenticated;

grant usage, select on all sequences in schema public to authenticated;

create policy "admin profile owner can read active profile"
on public.admin_profiles for select
to authenticated
using ((select auth.uid()) = user_id and is_active = true);

create policy "active admins manage admin profiles"
on public.admin_profiles for all
to authenticated
using ((select private.is_active_admin()))
with check ((select private.is_active_admin()));

create policy "public reads active champions"
on public.champions for select
to anon, authenticated
using (is_active = true);

create policy "active admins manage champions"
on public.champions for all
to authenticated
using ((select private.is_active_admin()))
with check ((select private.is_active_admin()));

create policy "public reads published events"
on public.events for select
to anon, authenticated
using (status in ('published', 'archived'));

create policy "active admins manage events"
on public.events for all
to authenticated
using ((select private.is_active_admin()))
with check ((select private.is_active_admin()));

create policy "public reads visible fight cards"
on public.fight_cards for select
to anon, authenticated
using (is_visible = true);

create policy "active admins manage fight cards"
on public.fight_cards for all
to authenticated
using ((select private.is_active_admin()))
with check ((select private.is_active_admin()));

create policy "public reads published news"
on public.news_posts for select
to anon, authenticated
using (status = 'published' and (published_at is null or published_at <= now()));

create policy "active admins manage news"
on public.news_posts for all
to authenticated
using ((select private.is_active_admin()))
with check ((select private.is_active_admin()));

create policy "public reads active sponsors"
on public.sponsors for select
to anon, authenticated
using (is_active = true);

create policy "active admins manage sponsors"
on public.sponsors for all
to authenticated
using ((select private.is_active_admin()))
with check ((select private.is_active_admin()));

create policy "public can create contact requests"
on public.contact_requests for insert
to anon, authenticated
with check (status = 'neu');

create policy "active admins manage contact requests"
on public.contact_requests for all
to authenticated
using ((select private.is_active_admin()))
with check ((select private.is_active_admin()));

create policy "public reads checked public media"
on public.media_assets for select
to anon, authenticated
using (is_public = true and is_checked = true);

create policy "active admins manage media"
on public.media_assets for all
to authenticated
using ((select private.is_active_admin()))
with check ((select private.is_active_admin()));

create policy "public reads public settings"
on public.site_settings for select
to anon, authenticated
using (is_public = true);

create policy "active admins manage settings"
on public.site_settings for all
to authenticated
using ((select private.is_active_admin()))
with check ((select private.is_active_admin()));

create policy "public reads published event results"
on public.event_results for select
to anon, authenticated
using (is_published = true);

create policy "active admins manage event results"
on public.event_results for all
to authenticated
using ((select private.is_active_admin()))
with check ((select private.is_active_admin()));

create policy "public reads published event gallery"
on public.event_gallery for select
to anon, authenticated
using (is_published = true);

create policy "active admins manage event gallery"
on public.event_gallery for all
to authenticated
using ((select private.is_active_admin()))
with check ((select private.is_active_admin()));

insert into storage.buckets (id, name, public)
values ('smashtime-media', 'smashtime-media', true)
on conflict (id) do update set public = excluded.public;

create policy "public reads smashtime media bucket"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'smashtime-media');

create policy "active admins upload smashtime media"
on storage.objects for insert
to authenticated
with check (bucket_id = 'smashtime-media' and (select private.is_active_admin()));

create policy "active admins update smashtime media"
on storage.objects for update
to authenticated
using (bucket_id = 'smashtime-media' and (select private.is_active_admin()))
with check (bucket_id = 'smashtime-media' and (select private.is_active_admin()));

create policy "active admins delete smashtime media"
on storage.objects for delete
to authenticated
using (bucket_id = 'smashtime-media' and (select private.is_active_admin()));
