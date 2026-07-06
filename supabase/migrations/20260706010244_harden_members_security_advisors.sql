create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function private.member_slug(display_name text, user_id uuid)
returns text
language sql
stable
set search_path = public
as $$
  select trim(both '-' from regexp_replace(lower(coalesce(display_name, 'mitglied')), '[^a-z0-9]+', '-', 'g'))
    || '-' || left(user_id::text, 8);
$$;

revoke all on function private.member_slug(text, uuid) from public, anon, authenticated;

drop policy if exists "public reads smashtime media bucket" on storage.objects;
drop policy if exists "staff reads smashtime media bucket" on storage.objects;
create policy "staff reads smashtime media bucket"
on storage.objects for select
to authenticated
using (bucket_id = 'smashtime-media' and (select private.has_permission('media.manage')));
