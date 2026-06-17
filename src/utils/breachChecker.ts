/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Computes locally the SHA-1 hash of a string using Web Crypto API.
 * Returns an uppercase 40-character hex string.
 */
async function sha1Hex(str: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-1', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
}

/**
 * Query Have I Been Pwned API securely using k-Anonymity model.
 * Fetches the 5-character SHA-1 prefix and compares the remaining 35 characters on Client Thread.
 * Never leaks the full SHA-1 hash or the plain-text password to the internet.
 */
export async function checkPwnedBreaches(password: string): Promise<{ breached: boolean; count: number }> {
  if (!password) {
    return { breached: false, count: 0 };
  }

  try {
    const fullHash = await sha1Hex(password);
    const prefix = fullHash.slice(0, 5);
    const suffix = fullHash.slice(5);

    // Fetch matching hash suffixes
    const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
    if (!response.ok) {
      throw new Error(`HIBP services status error: ${response.status}`);
    }

    const text = await response.text();
    const lines = text.split('\n');

    for (const line of lines) {
      const [lineSuffix, countStr] = line.trim().split(':');
      if (lineSuffix === suffix) {
        const count = parseInt(countStr, 10);
        return { breached: true, count };
      }
    }

    return { breached: false, count: 0 };
  } catch (err) {
    console.error('Have I Been Pwned connection error: ', err);
    // Suppress errors and assume not breached if network fails
    return { breached: false, count: 0 };
  }
}
