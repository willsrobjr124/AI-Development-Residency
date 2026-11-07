-- The balance time comes from the server, so a wrong phone clock can't hide an expense.
alter table public.user_settings alter column setup_step set default 'balance';

create function public.set_balance(p_balance_cents bigint)
returns void
language sql
security invoker
set search_path = ''
as $$
  update public.user_settings
  set balance_cents = p_balance_cents, balance_set_at = now(), updated_at = now()
  where user_id = auth.uid();
$$;

revoke all on function public.set_balance(bigint) from public, anon;
grant execute on function public.set_balance(bigint) to authenticated;
