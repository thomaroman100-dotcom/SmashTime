update public.events
set show_in_hero = false
where slug <> 'smashtime-3-respekt-steigt-in-den-ring'
  and show_in_hero = true;

update public.events
set
  name = 'SmashTime 3 - Gemeinsam gegen Mobbing',
  subtitle = 'Gemeinsam gegen Mobbing',
  image_path = '/images/events/smashtime-3-gemeinsam-gegen-mobbing.png',
  status = 'published',
  show_in_hero = true
where slug = 'smashtime-3-respekt-steigt-in-den-ring';

insert into public.site_settings (key, value, is_public)
values
  ('homepage.hero.title', '{"text":"Über SmashTime."}'::jsonb, true),
  ('homepage.hero.subtitle', '{"text":"Geboren als Untergrund-Format auf 12 Quadratmetern. Auf die große internationale Bühne."}'::jsonb, true),
  ('countdown.featuredEventId', '{"text":"smashtime-3-respekt-steigt-in-den-ring"}'::jsonb, true),
  ('countdown.countdownEndAt', '{"text":"2026-10-17T18:00:00+02:00"}'::jsonb, true)
on conflict (key) do update set
  value = excluded.value,
  is_public = excluded.is_public;
