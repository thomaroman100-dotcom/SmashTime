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
  status,
  show_in_hero
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
  array['Xtreme Boxen', 'K1', 'MMA', 'Boxen', 'Influenza Kämpfe'],
  null,
  '/images/events/smashtime-3-respekt-steigt-in-den-ring.png',
  null,
  'published',
  true
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
  status = excluded.status,
  show_in_hero = excluded.show_in_hero;

with event_row as (
  select id
  from public.events
  where slug = 'smashtime-3-respekt-steigt-in-den-ring'
),
updated_fight as (
  update public.fight_cards
  set
    sort_order = 30,
    label = 'Main Card',
    fighter_a_user_id = null,
    fighter_b_user_id = null,
    fighter_a = 'Just Rob',
    fighter_b = 'Karl-Heinz',
    fighter_a_image_path = '/images/fightcards/just-rob.png',
    fighter_b_image_path = '/images/fightcards/karl-heinz.png',
    fighter_a_is_tba = false,
    fighter_b_is_tba = false,
    weight_class = 'Wird nachgetragen',
    discipline = 'Influenza Kämpfe',
    is_main_event = false,
    is_visible = true,
    status = 'confirmed',
    notes = 'Bestätigte Paarung laut Eventposter vom 17.10.2026.',
    updated_at = now()
  where event_id = (select id from event_row)
    and lower(coalesce(fighter_a, '')) = 'just rob'
    and lower(coalesce(fighter_b, '')) = 'karl-heinz'
  returning id
)
insert into public.fight_cards (
  event_id,
  sort_order,
  label,
  fighter_a_user_id,
  fighter_b_user_id,
  fighter_a,
  fighter_b,
  fighter_a_image_path,
  fighter_b_image_path,
  fighter_a_is_tba,
  fighter_b_is_tba,
  weight_class,
  discipline,
  is_main_event,
  is_visible,
  status,
  notes
)
select
  event_row.id,
  30,
  'Main Card',
  null,
  null,
  'Just Rob',
  'Karl-Heinz',
  '/images/fightcards/just-rob.png',
  '/images/fightcards/karl-heinz.png',
  false,
  false,
  'Wird nachgetragen',
  'Influenza Kämpfe',
  false,
  true,
  'confirmed',
  'Bestätigte Paarung laut Eventposter vom 17.10.2026.'
from event_row
where not exists (select 1 from updated_fight);

insert into public.site_settings (key, value, is_public)
values
  ('countdown.featuredEventId', '{"text":"smashtime-3-respekt-steigt-in-den-ring"}'::jsonb, true),
  ('countdown.countdownEndAt', '{"text":"2026-10-17T18:00:00+02:00"}'::jsonb, true)
on conflict (key) do update set
  value = excluded.value,
  is_public = excluded.is_public;
