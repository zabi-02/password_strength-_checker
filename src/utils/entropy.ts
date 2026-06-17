/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { StrengthCategory } from '../types';

/**
 * Calculates the information entropy of a password in bits.
 * Entropy = Length * log2(Character Pool Size)
 */
export function calculateEntropy(password: string): { entropy: number; poolSize: number; category: StrengthCategory } {
  if (!password) {
    return { entropy: 0, poolSize: 0, category: 'VERY_WEAK' };
  }

  let poolSize = 0;
  let hasLower = false;
  let hasUpper = false;
  let hasDigit = false;
  let hasSym = false;

  // Track character pools represented in user string
  if (/[a-z]/.test(password)) {
    hasLower = true;
    poolSize += 26;
  }
  if (/[A-Z]/.test(password)) {
    hasUpper = true;
    poolSize += 26;
  }
  if (/[0-9]/.test(password)) {
    hasDigit = true;
    poolSize += 10;
  }
  if (/[^a-zA-Z0-9]/.test(password)) {
    hasSym = true;
    poolSize += 33; // Standard keyboard printable symbols
  }

  // Fallback for foreign/unicode character pools
  const uniqueChars = new Set(password.split(''));
  if (uniqueChars.size > poolSize) {
    poolSize = Math.max(poolSize, uniqueChars.size);
  }

  if (poolSize === 0) {
    return { entropy: 0, poolSize: 0, category: 'VERY_WEAK' };
  }

  // Calculate bits of entropy
  const entropy = password.length * Math.log2(poolSize);
  const roundedEntropy = Math.round(entropy * 10) / 10;

  // NIST and industry standards for entropy guidelines:
  // < 36 bits: Very Weak (susceptible to basic dictionary attacks)
  // 36-55 bits: Weak
  // 56-65 bits: Fair
  // 66-80 bits: Strong
  // 81-110 bits: Very Strong
  // > 110 bits: Excellent (virtually bulletproof)
  let category: StrengthCategory = 'VERY_WEAK';
  if (roundedEntropy >= 110) {
    category = 'EXCELLENT';
  } else if (roundedEntropy >= 80) {
    category = 'VERY_STRONG';
  } else if (roundedEntropy >= 65) {
    category = 'STRONG';
  } else if (roundedEntropy >= 50) {
    category = 'FAIR';
  } else if (roundedEntropy >= 32) {
    category = 'WEAK';
  } else {
    category = 'VERY_WEAK';
  }

  return { entropy: roundedEntropy, poolSize, category };
}
