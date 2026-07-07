create or replace function public.update_my_profile_settings(
  p_display_name text,
  p_avatar_url text default null,
  p_nickname text default null,
  p_origin text default null,
  p_public_bio text default null
)
returns table (
  user_id uuid,
  display_name text,
  avatar_url text,
  profile_type text,
  status text,
  nickname text,
  origin text,
  public_bio text
)
language plpgsql
security definer
set search_path = public, private
as $$
declare
  current_user_id uuid;
  current_profile_type text;
  safe_display_name text;
  safe_avatar_url text;
  safe_nickname text;
  safe_origin text;
  safe_public_bio text;
begin
  current_user_id := auth.uid();

  if current_user_id is null then
    raise exception 'Nicht angemeldet.';
  end if;

  safe_display_name := nullif(trim(coalesce(p_display_name, '')), '');
  safe_avatar_url := nullif(trim(coalesce(p_avatar_url, '')), '');
  safe_nickname := nullif(trim(coalesce(p_nickname, '')), '');
  safe_origin := nullif(trim(coalesce(p_origin, '')), '');
  safe_public_bio := nullif(trim(coalesce(p_public_bio, '')), '');

  if safe_display_name is null or char_length(safe_display_name) < 2 or char_length(safe_display_name) > 80 then
    raise exception 'Der Anzeigename muss zwischen 2 und 80 Zeichen lang sein.';
  end if;

  if safe_avatar_url is not null and char_length(safe_avatar_url) > 500 then
    raise exception 'Die Avatar-URL ist zu lang.';
  end if;

  if safe_nickname is not null and char_length(safe_nickname) > 80 then
    raise exception 'Der Kampfname ist zu lang.';
  end if;

  if safe_origin is not null and char_length(safe_origin) > 120 then
    raise exception 'Die Herkunft ist zu lang.';
  end if;

  if safe_public_bio is not null and char_length(safe_public_bio) > 500 then
    raise exception 'Die Profilnotiz ist zu lang.';
  end if;

  update public.profiles
  set
    display_name = safe_display_name,
    slug = private.member_slug(safe_display_name, current_user_id),
    avatar_url = safe_avatar_url
  where profiles.user_id = current_user_id
  returning profiles.profile_type into current_profile_type;

  if current_profile_type is null then
    raise exception 'Profil nicht gefunden.';
  end if;

  if current_profile_type = 'fighter' then
    insert into public.fighter_profiles (user_id, nickname, origin, public_bio)
    values (current_user_id, safe_nickname, safe_origin, safe_public_bio)
    on conflict (user_id) do update
    set
      nickname = excluded.nickname,
      origin = excluded.origin,
      public_bio = excluded.public_bio;
  end if;

  return query
  select
    p.user_id,
    p.display_name,
    p.avatar_url,
    p.profile_type,
    p.status,
    f.nickname,
    f.origin,
    f.public_bio
  from public.profiles p
  left join public.fighter_profiles f on f.user_id = p.user_id
  where p.user_id = current_user_id;
end;
$$;

revoke all on function public.update_my_profile_settings(text, text, text, text, text) from public;
revoke all on function public.update_my_profile_settings(text, text, text, text, text) from anon;
revoke all on function public.update_my_profile_settings(text, text, text, text, text) from authenticated;
grant execute on function public.update_my_profile_settings(text, text, text, text, text) to authenticated;
