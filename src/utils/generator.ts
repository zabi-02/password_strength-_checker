/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GeneratorOptions } from '../types';

const UPPER = 'ABCDEFGHJKLMNPQRSTUVWXYZ'; // Excluded I, O by default or as similar
const LOWER = 'abcdefghijkmnopqrstuvwxyz'; // Excluded l, o
const NUMS = '23456789'; // Excluded 1, 0
const SYMBOLS_SAFE = '!@#$%^&*()_+-=';
const SYMBOLS_AMBIGUOUS = '{}[]()/\'"`~,;:.<>';

/**
 * Generates an extremely robust, cryptographically sound password based on guidelines (Step 16).
 */
export function generatePassword(options: GeneratorOptions): string {
  let upperPool = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let lowerPool = 'abcdefghijklmnopqrstuvwxyz';
  let numPool = '0123456789';
  let symbolPool = SYMBOLS_SAFE + SYMBOLS_AMBIGUOUS;

  // 1. Similar character filters (i, l, 1, o, 0, O, I)
  if (options.excludeSimilar) {
    upperPool = 'ABCDEFGHJKLMNPQRSTUVWXYZ'; // Removed I, O
    lowerPool = 'abcdefghijkmnopqrstuvwxyz'; // Removed l, o
    numPool = '23456789'; // Removed 1, 0
  }

  // 2. Ambiguous symbol filters ({ } [ ] ( ) / \ ' " ` ~ , ; : . < >)
  if (options.excludeAmbiguous) {
    symbolPool = '!@#$%^&*_-+=?'; // Standard safe elements
  }

  // Assemble full pool
  let combinedPool = '';
  const guaranteedChars: string[] = [];

  // Cryptographically sound helper function to pick random byte indices
  const getRandomChar = (pool: string) => {
    if (!pool) return '';
    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    const randomIndex = array[0] % pool.length;
    return pool.charAt(randomIndex);
  };

  if (options.includeUppercase && upperPool.length > 0) {
    combinedPool += upperPool;
    guaranteedChars.push(getRandomChar(upperPool));
  }
  if (options.includeLowercase && lowerPool.length > 0) {
    combinedPool += lowerPool;
    guaranteedChars.push(getRandomChar(lowerPool));
  }
  if (options.includeNumbers && numPool.length > 0) {
    combinedPool += numPool;
    guaranteedChars.push(getRandomChar(numPool));
  }
  if (options.includeSymbols && symbolPool.length > 0) {
    combinedPool += symbolPool;
    guaranteedChars.push(getRandomChar(symbolPool));
  }

  // Fallback if everything is disabled
  if (combinedPool === '') {
    combinedPool = lowerPool;
    guaranteedChars.push(getRandomChar(lowerPool));
  }

  // Fill up the rest of the password length
  const remainingLength = options.length - guaranteedChars.length;
  for (let i = 0; i < remainingLength; i++) {
    guaranteedChars.push(getRandomChar(combinedPool));
  }

  // Statically shuffle the arrays so the guaranteed characters are distributed randomly.
  const shuffleArray = (array: string[]) => {
    const arr = [...array];
    const cryptVals = new Uint32Array(arr.length);
    window.crypto.getRandomValues(cryptVals);
    for (let i = arr.length - 1; i > 0; i--) {
      const j = cryptVals[i] % (i + 1);
      const temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
    }
    return arr.join('');
  };

  return shuffleArray(guaranteedChars);
}
