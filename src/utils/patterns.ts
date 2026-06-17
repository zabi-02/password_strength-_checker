/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { COMMON_PASSWORDS, DICTIONARY_WORDS } from '../data/commonPasswords';

/**
 * Normalizes string inputs to prevent injection and memory leaks.
 */
export function sanitizeInput(input: string): string {
  if (!input) return '';
  return input.slice(0, 128); // Force limits to prevent DoS via massive strings
}

/**
 * Checks if a string contains repeating contiguous segments of characters.
 * Catches 'aaaaaaaa', 'abababab', '12121212', 'abcabcabc'.
 */
export function hasRepeatedPatterns(val: string): { hasRepeats: boolean; explanation: string | null } {
  const len = val.length;
  if (len < 4) return { hasRepeats: false, explanation: null };

  const lowerVal = val.toLowerCase();

  // 1. Single character repetition, e.g., 'aaaa'
  for (let i = 0; i <= len - 4; i++) {
    const slice = lowerVal.slice(i, i + 4);
    if (/^(.)\1{3}$/.test(slice)) {
      return { hasRepeats: true, explanation: `Identical repeated sequence detected: "${val.slice(i, i + 4)}"` };
    }
  }

  // 2. Dual repeating patterns, e.g., 'abababab' (or '12121212')
  // We look for patterns of length 2 repeated 3 or more times or patterns of length 3 repeated twice
  for (let chunkLen = 2; chunkLen <= 4; chunkLen++) {
    for (let i = 0; i <= len - (chunkLen * 2); i++) {
      const pattern = lowerVal.slice(i, i + chunkLen);
      const following = lowerVal.slice(i + chunkLen, i + chunkLen * 2);
      if (pattern === following && pattern.trim().length > 0) {
        // Double check it's not simply the same character (handled by test 1)
        if (new Set(pattern.split('')).size > 1) {
          return { hasRepeats: true, explanation: `Cyclic repeating pattern detected: "${val.slice(i, i + chunkLen * 2)}"` };
        }
      }
    }
  }

  return { hasRepeats: false, explanation: null };
}

/**
 * Scans for keyboard sequences (e.g. qwerty, asdfgh, zxcvbn, poiuy, lkjhg) 
 * and sequence of digits/alphabets (e.g. 123456, abcdef, zyxwv, 987654)
 */
export function detectedStandardSequences(val: string): { hasSequence: boolean; explanations: string[] } {
  const lowerVal = val.toLowerCase();
  const explanations: string[] = [];

  // Common keyboard layouts rows
  const keyboardRows = [
    'qwertyuiop',
    'asdfghjkl',
    'zxcvbnm',
    'poiuytrewq', // reverse qwerty row
    'lkjhgfdsa',
    'mnbvcxz'
  ];

  // Alphabet forward and backward
  const alphabet = 'abcdefghijklmnopqrstuvwxyz';
  const revAlphabet = 'zyxwvutsrqponmlkjihgfedcba';

  // Number forward and backward (including the keypad 0)
  const numbers = '01234567890';
  const revNumbers = '09876543210';

  // Helper to find substring patterns of a minimum length
  const checkStreak = (source: string, minLen: number, label: string) => {
    for (let i = 0; i <= lowerVal.length - minLen; i++) {
      const sub = lowerVal.slice(i, i + minLen);
      // Check if this substring exists as-is inside our source pattern
      const index = source.indexOf(sub);
      if (index !== -1) {
        explanations.push(`Contains sequential dynamic ${label}: "${val.slice(i, i + minLen)}"`);
        return true;
      }
    }
    return false;
  };

  // Run sequence scans
  let detected = false;

  // Let's sweep keyboard sequences of min length 4 (e.g. "qwer", "asdf", "zxcv")
  for (const row of keyboardRows) {
    if (checkStreak(row, 4, 'keyboard pattern')) {
      detected = true;
    }
  }

  // Alphabetic streaks of min length 3 (e.g. "abc", "def", "xyz", "zyx")
  if (checkStreak(alphabet, 3, 'alphabetic sequence')) {
    detected = true;
  }
  if (checkStreak(revAlphabet, 3, 'reverse alphabet sequence')) {
    detected = true;
  }

  // Numeric streaks of min length 4 (e.g. "1234", "9876") or triplets if repeated, let's use 4 here
  if (checkStreak(numbers, 4, 'numerical sequence')) {
    detected = true;
  }
  if (checkStreak(revNumbers, 4, 'reverse numerical sequence')) {
    detected = true;
  }

  return { hasSequence: detected, explanations };
}

/**
 * Searches for exact dictionary matches in standard lists
 */
export function checkDictionaryMatches(val: string): { matched: boolean; matchWord: string | null } {
  const cleaned = val.toLowerCase().replace(/[^a-z]/g, ''); // Extract just letters
  if (cleaned.length < 3) return { matched: false, matchWord: null };

  // Check exact words first
  if (DICTIONARY_WORDS.has(cleaned)) {
    return { matched: true, matchWord: cleaned };
  }

  // Check if any standard dictionary word of length >=4 is inside the password
  for (const word of DICTIONARY_WORDS) {
    if (word.length >= 4 && cleaned.includes(word)) {
      return { matched: true, matchWord: word };
    }
  }

  return { matched: false, matchWord: null };
}

/**
 * Checks if the password is explicitly on the weak leaked list
 */
export function checkCommonPasswords(val: string): { matched: boolean; matchItem: string | null } {
  const normalized = val.toLowerCase();
  if (COMMON_PASSWORDS.has(normalized)) {
    return { matched: true, matchItem: val };
  }
  return { matched: false, matchItem: null };
}
