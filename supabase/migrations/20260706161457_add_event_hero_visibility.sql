alter table public.events
  add column if not exists show_in_hero boolean not null default false;

update public.events
set show_in_hero = true
where slug = 'smashtime-3-respekt-steigt-in-den-ring'
  and status = 'published'
  and image_path is not null;

create unique index if not exists events_single_hero_event_idx
  on public.events ((show_in_hero))
  where show_in_hero;
