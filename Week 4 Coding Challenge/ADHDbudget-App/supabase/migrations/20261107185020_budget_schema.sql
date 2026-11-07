-- ADHD Financial App: everything a person saves, locked to that person.
-- Money is whole cents. Bills fall on calendar days. Ids are made at the tap,
-- so a double tap or a retry can never save the same thing twice.

create table public.user_settings (
  user_id uuid primary key default auth.uid() references auth.users (id) on delete cascade,
  balance_cents bigint not null default 0 check (balance_cents >= 0),
  balance_set_at timestamptz not null default now(),
  next_payday date,
  setup_step text not null default 'welcome'
    check (setup_step in ('welcome', 'balance', 'payday', 'bills', 'savings', 'ready', 'done')),
  last_opened date,
  reduce_motion boolean not null default false,
  allow_screenshots boolean not null default false,
  bucket_hint_seen boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.bills (
  id uuid primary key,
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name text not null check (char_length(name) between 1 and 80),
  amount_cents bigint not null check (amount_cents > 0),
  due_date date not null,
  repeats_monthly boolean not null default true,
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.bill_payments (
  id uuid primary key,
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  bill_id uuid not null references public.bills (id) on delete cascade,
  amount_cents bigint not null check (amount_cents > 0),
  due_date date not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.expenses (
  id uuid primary key,
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  amount_cents bigint not null check (amount_cents > 0),
  category text check (category in ('Bills', 'Food', 'Fun', 'Transport', 'Other')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

-- A positive amount moves money into Savings. A negative amount moves it back.
create table public.savings_moves (
  id uuid primary key,
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  amount_cents bigint not null check (amount_cents <> 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index bills_user_due_idx on public.bills (user_id, due_date) where deleted_at is null;
create index bill_payments_user_idx on public.bill_payments (user_id, created_at);
create index bill_payments_bill_idx on public.bill_payments (bill_id);
create index expenses_user_created_idx on public.expenses (user_id, created_at desc);
create index savings_moves_user_idx on public.savings_moves (user_id);

alter table public.user_settings enable row level security;
alter table public.bills enable row level security;
alter table public.bill_payments enable row level security;
alter table public.expenses enable row level security;
alter table public.savings_moves enable row level security;

-- Signed-in people only, and only their own rows. Nothing is open to visitors.
revoke all on public.user_settings, public.bills, public.bill_payments, public.expenses,
  public.savings_moves from anon;
grant select, insert, update, delete on public.user_settings, public.bills, public.bill_payments,
  public.expenses, public.savings_moves to authenticated;

do $$
declare
  table_name text;
begin
  foreach table_name in array array['user_settings', 'bills', 'bill_payments', 'expenses', 'savings_moves'] loop
    execute format(
      'create policy "Read own rows" on public.%I for select to authenticated
         using ((select auth.uid()) = user_id)', table_name);
    execute format(
      'create policy "Add own rows" on public.%I for insert to authenticated
         with check ((select auth.uid()) = user_id)', table_name);
    execute format(
      'create policy "Change own rows" on public.%I for update to authenticated
         using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id)', table_name);
    execute format(
      'create policy "Remove own rows" on public.%I for delete to authenticated
         using ((select auth.uid()) = user_id)', table_name);
  end loop;
end $$;

-- A payment and the bill's next date change together, or not at all.
-- These run as the signed-in person, so the rules above still apply.
create function public.mark_bill_paid(p_payment_id uuid, p_bill_id uuid)
returns void
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_bill public.bills%rowtype;
  v_added integer;
begin
  select * into v_bill from public.bills where id = p_bill_id and deleted_at is null;
  if not found then
    raise exception 'That bill could not be found.';
  end if;

  insert into public.bill_payments (id, bill_id, amount_cents, due_date)
  values (p_payment_id, p_bill_id, v_bill.amount_cents, v_bill.due_date)
  on conflict (id) do nothing;
  get diagnostics v_added = row_count;
  if v_added = 0 then
    return;
  end if;

  if v_bill.repeats_monthly then
    update public.bills
    set due_date = (v_bill.due_date + interval '1 month')::date, updated_at = now()
    where id = p_bill_id;
  else
    update public.bills set paid_at = now(), updated_at = now() where id = p_bill_id;
  end if;
end;
$$;

create function public.undo_bill_paid(p_payment_id uuid)
returns void
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_payment public.bill_payments%rowtype;
begin
  select * into v_payment from public.bill_payments
  where id = p_payment_id and deleted_at is null;
  if not found then
    return;
  end if;

  update public.bill_payments set deleted_at = now(), updated_at = now() where id = p_payment_id;
  update public.bills
  set due_date = v_payment.due_date, paid_at = null, updated_at = now()
  where id = v_payment.bill_id;
end;
$$;

-- Items with no category move to Other, and the balance becomes the confirmed one.
-- Returns what Undo needs to put everything back.
create function public.fresh_start(p_balance_cents bigint)
returns jsonb
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_settings public.user_settings%rowtype;
  v_ids jsonb;
begin
  select * into v_settings from public.user_settings where user_id = auth.uid();
  if not found then
    raise exception 'Your settings could not be found.';
  end if;

  select coalesce(jsonb_agg(id), '[]'::jsonb) into v_ids from public.expenses
  where category is null and deleted_at is null;

  update public.expenses set category = 'Other', updated_at = now()
  where category is null and deleted_at is null;

  update public.user_settings
  set balance_cents = p_balance_cents, balance_set_at = now(), updated_at = now()
  where user_id = auth.uid();

  return jsonb_build_object(
    'balance_cents', v_settings.balance_cents,
    'balance_set_at', v_settings.balance_set_at,
    'expense_ids', v_ids
  );
end;
$$;

create function public.undo_fresh_start(p_undo jsonb)
returns void
language plpgsql
security invoker
set search_path = ''
as $$
begin
  update public.expenses set category = null, updated_at = now()
  where id in (select value::uuid from jsonb_array_elements_text(p_undo -> 'expense_ids'));

  update public.user_settings
  set balance_cents = (p_undo ->> 'balance_cents')::bigint,
      balance_set_at = (p_undo ->> 'balance_set_at')::timestamptz,
      updated_at = now()
  where user_id = auth.uid();
end;
$$;

-- Deleting an account needs more power than a signed-in person has, so that one
-- step lives in a private schema the API can't reach, and only ever acts on the caller.
create schema private;
revoke all on schema private from public, anon;
grant usage on schema private to authenticated;

create function private.delete_caller()
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null then
    raise exception 'You need to be logged in.';
  end if;
  delete from auth.users where id = auth.uid();
end;
$$;

create function public.delete_my_account()
returns void
language sql
security invoker
set search_path = ''
as $$
  select private.delete_caller();
$$;

revoke all on function private.delete_caller() from public, anon;
grant execute on function private.delete_caller() to authenticated;

revoke all on function public.mark_bill_paid(uuid, uuid), public.undo_bill_paid(uuid),
  public.fresh_start(bigint), public.undo_fresh_start(jsonb), public.delete_my_account()
  from public, anon;
grant execute on function public.mark_bill_paid(uuid, uuid), public.undo_bill_paid(uuid),
  public.fresh_start(bigint), public.undo_fresh_start(jsonb), public.delete_my_account()
  to authenticated;
