alter table public.fight_cards
  add column if not exists matchup_type text not null default 'single',
  add column if not exists corner_a_label text,
  add column if not exists corner_b_label text,
  add column if not exists corner_a_country_code text,
  add column if not exists corner_b_country_code text;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'fight_cards_matchup_type_check'
      and conrelid = 'public.fight_cards'::regclass
  ) then
    alter table public.fight_cards
      add constraint fight_cards_matchup_type_check
      check (matchup_type in ('single', 'team_2v2'));
  end if;
end $$;

update public.fight_cards
set
  matchup_type = coalesce(nullif(matchup_type, ''), 'single'),
  corner_a_label = coalesce(corner_a_label, fighter_a),
  corner_b_label = coalesce(corner_b_label, fighter_b)
where matchup_type = 'single';

create table if not exists public.fight_card_participants (
  id bigint generated always as identity primary key,
  fight_card_id bigint not null references public.fight_cards(id) on delete cascade,
  corner text not null check (corner in ('red', 'blue')),
  slot integer not null check (slot between 1 and 2),
  fighter_user_id uuid references public.fighter_profiles(user_id) on delete set null,
  display_name text,
  image_path text,
  is_tba boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (fight_card_id, corner, slot)
);

create index if not exists fight_card_participants_fight_card_id_idx
on public.fight_card_participants(fight_card_id);

create index if not exists fight_card_participants_fighter_user_id_idx
on public.fight_card_participants(fighter_user_id);

drop trigger if exists set_fight_card_participants_updated_at on public.fight_card_participants;
create trigger set_fight_card_participants_updated_at
before update on public.fight_card_participants
for each row execute function public.update_updated_at();

insert into public.fight_card_participants (
  fight_card_id,
  corner,
  slot,
  fighter_user_id,
  display_name,
  image_path,
  is_tba
)
select
  id,
  'red',
  1,
  fighter_a_user_id,
  fighter_a,
  fighter_a_image_path,
  fighter_a_is_tba
from public.fight_cards
where not exists (
  select 1
  from public.fight_card_participants participant
  where participant.fight_card_id = public.fight_cards.id
    and participant.corner = 'red'
    and participant.slot = 1
);

insert into public.fight_card_participants (
  fight_card_id,
  corner,
  slot,
  fighter_user_id,
  display_name,
  image_path,
  is_tba
)
select
  id,
  'blue',
  1,
  fighter_b_user_id,
  fighter_b,
  fighter_b_image_path,
  fighter_b_is_tba
from public.fight_cards
where not exists (
  select 1
  from public.fight_card_participants participant
  where participant.fight_card_id = public.fight_cards.id
    and participant.corner = 'blue'
    and participant.slot = 1
);

alter table public.fight_card_participants enable row level security;

grant select on public.fight_card_participants to anon;
grant select, insert, update, delete on public.fight_card_participants to authenticated;

drop policy if exists "anon reads visible fight card participants" on public.fight_card_participants;
create policy "anon reads visible fight card participants"
on public.fight_card_participants for select
to anon
using (
  exists (
    select 1
    from public.fight_cards fight
    where fight.id = fight_card_id
      and fight.is_visible = true
  )
);

drop policy if exists "authenticated reads visible or managed fight card participants" on public.fight_card_participants;
create policy "authenticated reads visible or managed fight card participants"
on public.fight_card_participants for select
to authenticated
using (
  exists (
    select 1
    from public.fight_cards fight
    where fight.id = fight_card_id
      and (fight.is_visible = true or (select private.has_permission('fightcards.manage')))
  )
);

drop policy if exists "staff inserts fight card participants" on public.fight_card_participants;
create policy "staff inserts fight card participants"
on public.fight_card_participants for insert
to authenticated
with check ((select private.has_permission('fightcards.manage')));

drop policy if exists "staff updates fight card participants" on public.fight_card_participants;
create policy "staff updates fight card participants"
on public.fight_card_participants for update
to authenticated
using ((select private.has_permission('fightcards.manage')))
with check ((select private.has_permission('fightcards.manage')));

drop policy if exists "staff deletes fight card participants" on public.fight_card_participants;
create policy "staff deletes fight card participants"
on public.fight_card_participants for delete
to authenticated
using ((select private.has_permission('fightcards.manage')));
