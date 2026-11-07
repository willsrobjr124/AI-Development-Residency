import { authErrorMessage, emailError, MIN_PASSWORD, passwordError } from './auth';

describe('emailError', () => {
  it.each(['', '   ', 'name.email.com', 'name@', '@email.com', 'name@email', 'a b@email.com'])(
    'refuses %j',
    (email) => {
      expect(emailError(email)).toBe('That email needs an @, like name@email.com');
    },
  );

  it('accepts a normal email, with spaces trimmed', () => {
    expect(emailError(' name@email.com ')).toBeNull();
  });
});

describe('passwordError', () => {
  it('asks for enough characters', () => {
    expect(passwordError('a'.repeat(MIN_PASSWORD - 1))).toBe(
      'Your password needs at least 8 characters',
    );
  });

  it('accepts 8 characters', () => {
    expect(passwordError('a'.repeat(MIN_PASSWORD))).toBeNull();
  });
});

describe('authErrorMessage', () => {
  it('never blames the person or shows a code', () => {
    expect(authErrorMessage({ code: 'invalid_credentials' })).toBe(
      "That email and password don't match. Try again, or reset your password.",
    );
  });

  it('points to log in when an email is taken', () => {
    expect(authErrorMessage({ code: 'user_already_exists' })).toBe(
      'That email already has an account. You can log in instead.',
    );
  });

  it('explains a code that has run out', () => {
    expect(authErrorMessage({ code: 'otp_expired' })).toBe(
      "That code didn't work. Check it, or send a new one.",
    );
  });

  it('explains the email limit calmly', () => {
    expect(authErrorMessage({ code: 'over_email_send_rate_limit' })).toBe(
      'Too many emails just now. Wait a few minutes, then try again.',
    );
  });

  it('falls back to a calm connection message', () => {
    expect(authErrorMessage({ code: 'something_new' })).toBe(
      "We couldn't connect just now. Your money is safe, so try again.",
    );
    expect(authErrorMessage(new Error('Network request failed'))).toBe(
      "We couldn't connect just now. Your money is safe, so try again.",
    );
  });
});
