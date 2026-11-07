export const MIN_PASSWORD = 8;

export function emailError(email: string): string | null {
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  return valid ? null : 'That email needs an @, like name@email.com';
}

export function passwordError(password: string): string | null {
  return password.length >= MIN_PASSWORD
    ? null
    : `Your password needs at least ${MIN_PASSWORD} characters`;
}

const MESSAGES: Record<string, string> = {
  invalid_credentials: "That email and password don't match. Try again, or reset your password.",
  user_already_exists: 'That email already has an account. You can log in instead.',
  email_exists: 'That email already has an account. You can log in instead.',
  otp_expired: "That code didn't work. Check it, or send a new one.",
  weak_password: 'That password is too easy to guess. Try a longer one.',
  same_password: 'That is your current password. Try a new one.',
  over_email_send_rate_limit: 'Too many emails just now. Wait a few minutes, then try again.',
  over_request_rate_limit: 'Too many tries just now. Wait a few minutes, then try again.',
};

const FALLBACK = "We couldn't connect just now. Your money is safe, so try again.";

/** Turns a sign-in problem into plain words. No error codes reach the screen. */
export function authErrorMessage(error: unknown): string {
  const code = (error as { code?: string } | null)?.code;
  return (code && MESSAGES[code]) || FALLBACK;
}
