insert into public.events (
  slug,
  name,
  short_name,
  subtitle,
  event_date,
  date_label,
  location,
  address,
  admission,
  starts_at,
  disciplines,
  gastro,
  image_path,
  ticket_url,
  status
)
values (
  'smashtime-3-respekt-steigt-in-den-ring',
  'SmashTime 3 - Respekt steigt in den Ring',
  'SmashTime 3',
  'Respekt steigt in den Ring',
  '2026-10-17T18:00:00+02:00',
  '17. Oktober 2026',
  'Jahnturnhalle St. Pölten',
  'Jahnstraße 15, 3100 St. Pölten',
  '17:00',
  '18:00',
  array['Xtreme Boxen', 'K1', 'MMA', 'Boxen'],
  null,
  '/images/events/smashtime-3-respekt-steigt-in-den-ring.png',
  null,
  'published'
)
on conflict (slug) do update set
  name = excluded.name,
  short_name = excluded.short_name,
  subtitle = excluded.subtitle,
  event_date = excluded.event_date,
  date_label = excluded.date_label,
  location = excluded.location,
  address = excluded.address,
  admission = excluded.admission,
  starts_at = excluded.starts_at,
  disciplines = excluded.disciplines,
  gastro = excluded.gastro,
  image_path = excluded.image_path,
  ticket_url = excluded.ticket_url,
  status = excluded.status;

insert into public.site_settings (key, value, is_public)
values
  ('countdown.featuredEventId', '{"text":"smashtime-3-respekt-steigt-in-den-ring"}'::jsonb, true),
  ('countdown.countdownEndAt', '{"text":"2026-10-17T18:00:00+02:00"}'::jsonb, true)
on conflict (key) do update set
  value = excluded.value,
  is_public = excluded.is_public;
