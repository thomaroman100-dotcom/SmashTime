-- Keep public site media classified consistently with the media_assets RLS model.
-- Existing event/news/sponsor uploads were written as public site assets before
-- the stricter member-role migration, so mark those public assets as checked.
update public.media_assets
set is_checked = true
where bucket = 'smashtime-media'
  and is_public = true
  and asset_type in ('Veranstaltung', 'News', 'Sponsor');

drop policy if exists "public reads checked smashtime media bucket" on storage.objects;
create policy "public reads checked smashtime media bucket"
on storage.objects for select
to anon, authenticated
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

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.contact_requests'::regclass
      and conname = 'contact_requests_name_length'
  ) then
    alter table public.contact_requests
      add constraint contact_requests_name_length
      check (char_length(btrim(name)) between 2 and 80)
      not valid;
  end if;

  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.contact_requests'::regclass
      and conname = 'contact_requests_email_format'
  ) then
    alter table public.contact_requests
      add constraint contact_requests_email_format
      check (
        char_length(btrim(email)) between 5 and 120
        and email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$'
      )
      not valid;
  end if;

  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.contact_requests'::regclass
      and conname = 'contact_requests_subject_length'
  ) then
    alter table public.contact_requests
      add constraint contact_requests_subject_length
      check (subject is null or char_length(btrim(subject)) <= 120)
      not valid;
  end if;

  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.contact_requests'::regclass
      and conname = 'contact_requests_message_length'
  ) then
    alter table public.contact_requests
      add constraint contact_requests_message_length
      check (char_length(btrim(message)) between 10 and 1500)
      not valid;
  end if;
end $$;
