alter table public.fight_cards
  add column if not exists rounds integer not null default 3,
  add column if not exists round_duration text not null default '3 Minuten',
  add column if not exists scheduled_at timestamptz,
  add column if not exists winner_corner text;

do $$
begin
  if exists (
    select 1
    from pg_constraint
    where conname = 'fight_cards_matchup_type_check'
      and conrelid = 'public.fight_cards'::regclass
  ) then
    alter table public.fight_cards
      drop constraint fight_cards_matchup_type_check;
  end if;

  alter table public.fight_cards
    add constraint fight_cards_matchup_type_check
    check (matchup_type in ('single', 'team_1v1', 'team_2v2', 'team_3v3', 'team_4v4'));

  if not exists (
    select 1
    from pg_constraint
    where conname = 'fight_cards_winner_corner_check'
      and conrelid = 'public.fight_cards'::regclass
  ) then
    alter table public.fight_cards
      add constraint fight_cards_winner_corner_check
      check (winner_corner is null or winner_corner in ('red', 'blue'));
  end if;
end $$;

do $$
begin
  if exists (
    select 1
    from pg_constraint
    where conname = 'fight_card_participants_slot_check'
      and conrelid = 'public.fight_card_participants'::regclass
  ) then
    alter table public.fight_card_participants
      drop constraint fight_card_participants_slot_check;
  end if;

  alter table public.fight_card_participants
    add constraint fight_card_participants_slot_check
    check (slot between 1 and 4);
end $$;

create table if not exists public.fightcard_settings (
  id bigint generated always as identity primary key,
  event_id bigint not null references public.events(id) on delete cascade unique,
  general jsonb not null default '{}'::jsonb,
  display jsonb not null default '{}'::jsonb,
  tournament jsonb not null default '{}'::jsonb,
  system jsonb not null default '{}'::jsonb,
  categories jsonb not null default '[]'::jsonb,
  weight_classes jsonb not null default '[]'::jsonb,
  rules jsonb not null default '{}'::jsonb,
  points jsonb not null default '{}'::jsonb,
  media jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists fightcard_settings_event_id_idx
on public.fightcard_settings(event_id);

drop trigger if exists set_fightcard_settings_updated_at on public.fightcard_settings;
create trigger set_fightcard_settings_updated_at
before update on public.fightcard_settings
for each row execute function public.set_updated_at();

alter table public.fightcard_settings enable row level security;

grant select on public.fightcard_settings to anon;
grant select, insert, update, delete on public.fightcard_settings to authenticated;
grant usage, select on sequence public.fightcard_settings_id_seq to authenticated;

drop policy if exists "public reads fightcard settings for visible events" on public.fightcard_settings;
create policy "public reads fightcard settings for visible events"
on public.fightcard_settings for select
to anon
using (
  exists (
    select 1
    from public.events event
    where event.id = event_id
      and event.status = 'published'
  )
);

drop policy if exists "authenticated reads fightcard settings" on public.fightcard_settings;
create policy "authenticated reads fightcard settings"
on public.fightcard_settings for select
to authenticated
using (
  exists (
    select 1
    from public.events event
    where event.id = event_id
      and (event.status = 'published' or (select private.has_permission('fightcards.manage')))
  )
);

drop policy if exists "staff inserts fightcard settings" on public.fightcard_settings;
create policy "staff inserts fightcard settings"
on public.fightcard_settings for insert
to authenticated
with check ((select private.has_permission('fightcards.manage')));

drop policy if exists "staff updates fightcard settings" on public.fightcard_settings;
create policy "staff updates fightcard settings"
on public.fightcard_settings for update
to authenticated
using ((select private.has_permission('fightcards.manage')))
with check ((select private.has_permission('fightcards.manage')));

drop policy if exists "staff deletes fightcard settings" on public.fightcard_settings;
create policy "staff deletes fightcard settings"
on public.fightcard_settings for delete
to authenticated
using ((select private.has_permission('fightcards.manage')));
