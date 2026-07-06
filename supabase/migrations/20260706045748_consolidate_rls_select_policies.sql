-- Consolidate overlapping permissive RLS policies reported by Supabase advisors.
-- Broad "for all" staff policies also apply to SELECT, so authenticated users
-- ended up evaluating duplicate read policies on many public tables.

-- Champions
drop policy if exists "public reads active champions" on public.champions;
drop policy if exists "staff manage champions" on public.champions;
create policy "anon reads active champions"
on public.champions for select
to anon
using (is_active = true);
create policy "authenticated reads visible or managed champions"
on public.champions for select
to authenticated
using (is_active = true or (select private.has_permission('champions.manage')));
create policy "staff inserts champions"
on public.champions for insert
to authenticated
with check ((select private.has_permission('champions.manage')));
create policy "staff updates champions"
on public.champions for update
to authenticated
using ((select private.has_permission('champions.manage')))
with check ((select private.has_permission('champions.manage')));
create policy "staff deletes champions"
on public.champions for delete
to authenticated
using ((select private.has_permission('champions.manage')));

-- Events
drop policy if exists "public reads published events" on public.events;
drop policy if exists "fightcard staff read events" on public.events;
drop policy if exists "settings staff read events" on public.events;
drop policy if exists "staff manage events" on public.events;
create policy "anon reads published events"
on public.events for select
to anon
using (status = any (array['published'::text, 'archived'::text]));
create policy "authenticated reads visible or managed events"
on public.events for select
to authenticated
using (
  status = any (array['published'::text, 'archived'::text])
  or (select private.has_permission('events.manage'))
  or (select private.has_permission('fightcards.manage'))
  or (select private.has_permission('settings.manage'))
);
create policy "staff inserts events"
on public.events for insert
to authenticated
with check ((select private.has_permission('events.manage')));
create policy "staff updates events"
on public.events for update
to authenticated
using ((select private.has_permission('events.manage')))
with check ((select private.has_permission('events.manage')));
create policy "staff deletes events"
on public.events for delete
to authenticated
using ((select private.has_permission('events.manage')));

-- Fight cards
drop policy if exists "public reads visible fight cards" on public.fight_cards;
drop policy if exists "staff manage fight cards" on public.fight_cards;
create policy "anon reads visible fight cards"
on public.fight_cards for select
to anon
using (is_visible = true);
create policy "authenticated reads visible or managed fight cards"
on public.fight_cards for select
to authenticated
using (is_visible = true or (select private.has_permission('fightcards.manage')));
create policy "staff inserts fight cards"
on public.fight_cards for insert
to authenticated
with check ((select private.has_permission('fightcards.manage')));
create policy "staff updates fight cards"
on public.fight_cards for update
to authenticated
using ((select private.has_permission('fightcards.manage')))
with check ((select private.has_permission('fightcards.manage')));
create policy "staff deletes fight cards"
on public.fight_cards for delete
to authenticated
using ((select private.has_permission('fightcards.manage')));

-- News
drop policy if exists "public reads published news" on public.news_posts;
drop policy if exists "staff manage news" on public.news_posts;
create policy "anon reads published news"
on public.news_posts for select
to anon
using (status = 'published' and (published_at is null or published_at <= now()));
create policy "authenticated reads visible or managed news"
on public.news_posts for select
to authenticated
using (
  (status = 'published' and (published_at is null or published_at <= now()))
  or (select private.has_permission('news.manage'))
);
create policy "staff inserts news"
on public.news_posts for insert
to authenticated
with check ((select private.has_permission('news.manage')));
create policy "staff updates news"
on public.news_posts for update
to authenticated
using ((select private.has_permission('news.manage')))
with check ((select private.has_permission('news.manage')));
create policy "staff deletes news"
on public.news_posts for delete
to authenticated
using ((select private.has_permission('news.manage')));

-- Sponsors
drop policy if exists "public reads active sponsors" on public.sponsors;
drop policy if exists "staff manage sponsors" on public.sponsors;
create policy "anon reads active sponsors"
on public.sponsors for select
to anon
using (is_active = true);
create policy "authenticated reads visible or managed sponsors"
on public.sponsors for select
to authenticated
using (is_active = true or (select private.has_permission('sponsors.manage')));
create policy "staff inserts sponsors"
on public.sponsors for insert
to authenticated
with check ((select private.has_permission('sponsors.manage')));
create policy "staff updates sponsors"
on public.sponsors for update
to authenticated
using ((select private.has_permission('sponsors.manage')))
with check ((select private.has_permission('sponsors.manage')));
create policy "staff deletes sponsors"
on public.sponsors for delete
to authenticated
using ((select private.has_permission('sponsors.manage')));

-- Public media metadata
drop policy if exists "public reads checked public media" on public.media_assets;
drop policy if exists "staff manage media" on public.media_assets;
create policy "anon reads checked public media"
on public.media_assets for select
to anon
using (is_public = true and is_checked = true);
create policy "authenticated reads visible or managed media"
on public.media_assets for select
to authenticated
using ((is_public = true and is_checked = true) or (select private.has_permission('media.manage')));
create policy "staff inserts media"
on public.media_assets for insert
to authenticated
with check ((select private.has_permission('media.manage')));
create policy "staff updates media"
on public.media_assets for update
to authenticated
using ((select private.has_permission('media.manage')))
with check ((select private.has_permission('media.manage')));
create policy "staff deletes media"
on public.media_assets for delete
to authenticated
using ((select private.has_permission('media.manage')));

-- Site settings
drop policy if exists "public reads public settings" on public.site_settings;
drop policy if exists "staff manage settings" on public.site_settings;
create policy "anon reads public settings"
on public.site_settings for select
to anon
using (is_public = true);
create policy "authenticated reads visible or managed settings"
on public.site_settings for select
to authenticated
using (is_public = true or (select private.has_permission('settings.manage')));
create policy "staff inserts settings"
on public.site_settings for insert
to authenticated
with check ((select private.has_permission('settings.manage')));
create policy "staff updates settings"
on public.site_settings for update
to authenticated
using ((select private.has_permission('settings.manage')))
with check ((select private.has_permission('settings.manage')));
create policy "staff deletes settings"
on public.site_settings for delete
to authenticated
using ((select private.has_permission('settings.manage')));

-- Event results
drop policy if exists "public reads published event results" on public.event_results;
drop policy if exists "staff manage event results" on public.event_results;
create policy "anon reads published event results"
on public.event_results for select
to anon
using (is_published = true);
create policy "authenticated reads visible or managed event results"
on public.event_results for select
to authenticated
using (is_published = true or (select private.has_permission('events.manage')));
create policy "staff inserts event results"
on public.event_results for insert
to authenticated
with check ((select private.has_permission('events.manage')));
create policy "staff updates event results"
on public.event_results for update
to authenticated
using ((select private.has_permission('events.manage')))
with check ((select private.has_permission('events.manage')));
create policy "staff deletes event results"
on public.event_results for delete
to authenticated
using ((select private.has_permission('events.manage')));

-- Event gallery
drop policy if exists "public reads published event gallery" on public.event_gallery;
drop policy if exists "staff manage event gallery" on public.event_gallery;
create policy "anon reads published event gallery"
on public.event_gallery for select
to anon
using (is_published = true);
create policy "authenticated reads visible or managed event gallery"
on public.event_gallery for select
to authenticated
using (
  is_published = true
  or (select private.has_permission('events.manage'))
  or (select private.has_permission('media.manage'))
);
create policy "staff inserts event gallery"
on public.event_gallery for insert
to authenticated
with check ((select private.has_permission('events.manage')) or (select private.has_permission('media.manage')));
create policy "staff updates event gallery"
on public.event_gallery for update
to authenticated
using ((select private.has_permission('events.manage')) or (select private.has_permission('media.manage')))
with check ((select private.has_permission('events.manage')) or (select private.has_permission('media.manage')));
create policy "staff deletes event gallery"
on public.event_gallery for delete
to authenticated
using ((select private.has_permission('events.manage')) or (select private.has_permission('media.manage')));

-- Contact requests: public insert remains one policy for anon/authenticated;
-- staff management does not need an overlapping INSERT policy.
drop policy if exists "staff manage contact requests" on public.contact_requests;
create policy "staff reads contact requests"
on public.contact_requests for select
to authenticated
using ((select private.has_permission('contact.manage')));
create policy "staff updates contact requests"
on public.contact_requests for update
to authenticated
using ((select private.has_permission('contact.manage')))
with check ((select private.has_permission('contact.manage')));
create policy "staff deletes contact requests"
on public.contact_requests for delete
to authenticated
using ((select private.has_permission('contact.manage')));

-- Member/admin tables: combine owner reads and admin/staff reads into one
-- authenticated SELECT policy per table.
drop policy if exists "admin profile owner can read active profile" on public.admin_profiles;
drop policy if exists "admins manage admin profiles" on public.admin_profiles;
create policy "authenticated reads permitted admin profiles"
on public.admin_profiles for select
to authenticated
using (
  ((select auth.uid()) = user_id and is_active = true)
  or (select private.is_admin())
);
create policy "admins insert admin profiles"
on public.admin_profiles for insert
to authenticated
with check ((select private.is_admin()));
create policy "admins update admin profiles"
on public.admin_profiles for update
to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));
create policy "admins delete admin profiles"
on public.admin_profiles for delete
to authenticated
using ((select private.is_admin()));

drop policy if exists "profile owner can read profile" on public.profiles;
drop policy if exists "authorized staff can read member profiles" on public.profiles;
drop policy if exists "authorized staff manage member profiles" on public.profiles;
create policy "authenticated reads permitted member profiles"
on public.profiles for select
to authenticated
using (
  (select auth.uid()) = user_id
  or (select private.has_permission('users.manage'))
  or (select private.has_permission('fighters.manage'))
  or (select private.has_permission('champions.manage'))
  or (select private.has_permission('fightcards.manage'))
);
create policy "staff inserts member profiles"
on public.profiles for insert
to authenticated
with check ((select private.has_permission('users.manage')));
create policy "staff updates member profiles"
on public.profiles for update
to authenticated
using ((select private.has_permission('users.manage')))
with check ((select private.has_permission('users.manage')));
create policy "staff deletes member profiles"
on public.profiles for delete
to authenticated
using ((select private.has_permission('users.manage')));

drop policy if exists "profile owner can read fighter profile" on public.fighter_profiles;
drop policy if exists "authorized staff can read fighter profiles" on public.fighter_profiles;
drop policy if exists "authorized staff manage fighter profiles" on public.fighter_profiles;
create policy "authenticated reads permitted fighter profiles"
on public.fighter_profiles for select
to authenticated
using (
  (select auth.uid()) = user_id
  or (select private.has_permission('users.manage'))
  or (select private.has_permission('fighters.manage'))
  or (select private.has_permission('champions.manage'))
  or (select private.has_permission('fightcards.manage'))
);
create policy "staff inserts fighter profiles"
on public.fighter_profiles for insert
to authenticated
with check ((select private.has_permission('users.manage')) or (select private.has_permission('fighters.manage')));
create policy "staff updates fighter profiles"
on public.fighter_profiles for update
to authenticated
using ((select private.has_permission('users.manage')) or (select private.has_permission('fighters.manage')))
with check ((select private.has_permission('users.manage')) or (select private.has_permission('fighters.manage')));
create policy "staff deletes fighter profiles"
on public.fighter_profiles for delete
to authenticated
using ((select private.has_permission('users.manage')) or (select private.has_permission('fighters.manage')));

drop policy if exists "staff can read own permissions" on public.staff_permissions;
drop policy if exists "admins manage staff permissions" on public.staff_permissions;
create policy "authenticated reads permitted staff permissions"
on public.staff_permissions for select
to authenticated
using ((select auth.uid()) = user_id or (select private.is_admin()));
create policy "admins insert staff permissions"
on public.staff_permissions for insert
to authenticated
with check ((select private.is_admin()));
create policy "admins update staff permissions"
on public.staff_permissions for update
to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));
create policy "admins delete staff permissions"
on public.staff_permissions for delete
to authenticated
using ((select private.is_admin()));

-- Storage object reads
drop policy if exists "public reads checked smashtime media bucket" on storage.objects;
drop policy if exists "staff reads smashtime media bucket" on storage.objects;
create policy "anon reads checked smashtime media bucket"
on storage.objects for select
to anon
using (
  bucket_id = 'smashtime-media'
  and exists (
    select 1
    from public.media_assets
    where media_assets.bucket = storage.objects.bucket_id
      and media_assets.path = storage.objects.name
      and media_assets.is_public = true
      and media_assets.is_checked = true
  )
);
create policy "authenticated reads visible or managed smashtime media bucket"
on storage.objects for select
to authenticated
using (
  bucket_id = 'smashtime-media'
  and (
    (select private.has_permission('media.manage'))
    or exists (
      select 1
      from public.media_assets
      where media_assets.bucket = storage.objects.bucket_id
        and media_assets.path = storage.objects.name
        and media_assets.is_public = true
        and media_assets.is_checked = true
    )
  )
);
