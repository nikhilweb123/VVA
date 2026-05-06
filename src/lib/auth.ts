import { createHmac, timingSafeEqual, randomBytes } from 'crypto';
import { cookies } from 'next/headers';

const COOKIE_NAME = '__Secure-admin_session';
// Fall back to dev-only secret so the site doesn't crash locally without env vars,
// but production will fail loudly if neither secret is set (see getSecret).
const DEV_SECRET = 'dev-only-secret-NOT-for-production';

function getSecret(): string {
  const secret = process.env.ADMIN_SECRET ?? process.env.NEXTAUTH_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('ADMIN_SECRET (or NEXTAUTH_SECRET) must be set in production.');
    }
    return DEV_SECRET;
  }
  return secret;
}

/** Create a signed session token: `<random>.<hmac>` */
export function createSessionToken(): string {
  const nonce = randomBytes(32).toString('hex');
  const secret = getSecret();
  const sig = createHmac('sha256', secret).update(nonce).digest('hex');
  return `${nonce}.${sig}`;
}

/** Verify a signed session token. Constant-time comparison prevents timing attacks. */
export function verifySessionToken(token: string): boolean {
  const lastDot = token.lastIndexOf('.');
  if (lastDot === -1) return false;
  const nonce = token.substring(0, lastDot);
  const providedSig = token.substring(lastDot + 1);
  try {
    const secret = getSecret();
    const expectedSig = createHmac('sha256', secret).update(nonce).digest('hex');
    return timingSafeEqual(
      Buffer.from(providedSig, 'hex'),
      Buffer.from(expectedSig, 'hex'),
    );
  } catch {
    return false;
  }
}

/** Set the signed session cookie (call from login route). */
export async function setSessionCookie(): Promise<void> {
  const token = createSessionToken();
  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: true,           // __Secure- prefix requires this
    sameSite: 'strict',
    maxAge: 60 * 60 * 24,  // 24 h
    path: '/',
  });
}

/** Clear the session cookie. */
export async function clearSessionCookie(): Promise<void> {
  const store = await cookies();

  // To reliably clear a cookie, we must match the path and secure flags used when setting it.
  const clearOptions = {
    httpOnly: true,
    secure: true,
    sameSite: 'strict' as const,
    maxAge: 0,
    path: '/',
  };

  store.set('__Secure-admin_session', '', clearOptions);
  store.set('admin_session', '', clearOptions); // Clear legacy cookie too
}

/** Returns true if the current request carries a valid signed session. */
export async function isAuthenticated(): Promise<boolean> {
  try {
    const store = await cookies();
    // Accept both the new __Secure- name and the legacy name during migration
    const token =
      store.get(COOKIE_NAME)?.value ??
      store.get('admin_session')?.value;
    if (!token) return false;
    // Legacy plain-string cookie check (allows existing sessions to keep working
    // for one session lifetime while we roll the new signed format out)
    if (token === 'true') return false; // force re-login for old format
    return verifySessionToken(token);
  } catch {
    return false;
  }
}
