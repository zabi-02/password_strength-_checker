/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AnalysisResult, StrengthCategory } from '../types';
import { calculateEntropy } from './entropy';
import { estimateCrackingTime } from './crackers';
import { 
  hasRepeatedPatterns, 
  detectedStandardSequences, 
  checkDictionaryMatches, 
  checkCommonPasswords, 
  sanitizeInput 
} from './patterns';

/**
 * Analyzes a password string completely locally on the client's thread.
 * Returns a high-precision analysis breakdown including entropy, score, patterns, 
 * cracks estimates, suggestions list, and checklist state.
 */
export function analyzePassword(password: string): AnalysisResult {
  const startTime = performance.now();
  
  const sanitized = sanitizeInput(password);
  
  // 1. Core State Triggers
  const len = sanitized.length;
  const hasUpper = /[A-Z]/.test(sanitized);
  const hasLower = /[a-z]/.test(sanitized);
  const hasDigit = /[0-9]/.test(sanitized);
  const hasSpecial = /[^a-zA-Z0-9]/.test(sanitized);

  // 2. Pattern Verification Results
  const repeatsCheck = hasRepeatedPatterns(sanitized);
  const sequencesCheck = detectedStandardSequences(sanitized);
  const dictionaryCheck = checkDictionaryMatches(sanitized);
  const commonLeakCheck = checkCommonPasswords(sanitized);

  // 3. Flags and Checklist values
  const isLengthValid = len >= 8 && len <= 128;
  const isUppercaseValid = hasUpper;
  const isLowercaseValid = hasLower;
  const isNumberValid = hasDigit;
  const isSpecialValid = hasSpecial;

  const noSequence = !sequencesCheck.hasSequence;
  const noRepeated = !repeatsCheck.hasRepeats;
  const noCommon = !commonLeakCheck.matched;
  const noDictionary = !dictionaryCheck.matched;

  // Single-class rejections check (Step 4 - e.g., reject only lowercase/only uppercase)
  let passesDiversity = true;
  const activePoolsCount = (hasLower ? 1 : 0) + (hasUpper ? 1 : 0) + (hasDigit ? 1 : 0) + (hasSpecial ? 1 : 0);
  if (activePoolsCount <= 1 && len > 0) {
    passesDiversity = false;
  }

  // 4. Score Calculation out of 100 index (Step 11)
  let lengthScore = 0;
  if (len >= 16) lengthScore = 25;
  else if (len >= 12) lengthScore = 20;
  else if (len >= 8) lengthScore = 15;
  else if (len > 0) lengthScore = Math.min(len * 1.5, 10);

  const uppercaseScore = (hasUpper && passesDiversity) ? 10 : 0;
  const lowercaseScore = (hasLower && passesDiversity) ? 10 : 0;
  const numberScore = (hasDigit && passesDiversity) ? 10 : 0;
  const specialScore = (hasSpecial && passesDiversity) ? 15 : 0;

  // Calculate Entropy Core
  const entropyInfo = calculateEntropy(sanitized);
  // Entropy score: up to 20 points
  const entropyScore = Math.min(Math.round((entropyInfo.entropy / 100) * 20), 20);

  // Patterns deduct score: base 10 points
  let patternsScore = 10;
  if (!noSequence) patternsScore -= 4;
  if (!noRepeated) patternsScore -= 3;
  if (!noCommon) patternsScore -= 3;
  if (!noDictionary) patternsScore -= 2;
  patternsScore = Math.max(0, patternsScore);

  let rawTotalScore = lengthScore + uppercaseScore + lowercaseScore + numberScore + specialScore + entropyScore + patternsScore;
  
  // Clamp total between 0 and 100
  let score = Math.min(Math.max(Math.round(rawTotalScore), 0), 100);
  if (password.length === 0) {
    score = 0;
  }

  // 5. Gather Suggestions and Alerts
  const suggestions: string[] = [];
  const detectedPatterns: string[] = [];

  if (len === 0) {
    // Empty state suggestion
    suggestions.push('Enter a secure password to initialize threat calculations.');
  } else {
    // Length suggestions
    if (len < 8) {
      suggestions.push('NIST recommends passwords to be at least 8 characters long (12+ is safer for general use).');
    } else if (len >= 64) {
      suggestions.push('Incredible length! Ensure your accounts are not capped by legacy size-limit validators.');
    }

    // Capital/Lower/Sym suggestions
    if (!hasUpper) suggestions.push('Incorporate uppercase letters (A-Z) to introduce character complexity.');
    if (!hasLower) suggestions.push('Add lowercase letters (a-z) to widen the brute force search space.');
    if (!hasDigit) suggestions.push('Include numerals (0-9) to strengthen pattern randomization.');
    if (!hasSpecial) suggestions.push('Equip with special symbols (~!@#$%^&*) to guard against smart dictionary filters.');

    // Diverse guidelines
    if (!passesDiversity) {
      suggestions.push('Avoid using characters from only a single category (e.g. only numbers or only letters) as hash arrays will crack these instantly.');
    }

    // Patterns visual reports
    if (repeatsCheck.explanation) {
      detectedPatterns.push(repeatsCheck.explanation);
      suggestions.push('Avoid repeating elements like "aaaa" or "ababab". Smart cracking rules prioritize cyclic strings.');
    }
    if (sequencesCheck.hasSequence) {
      sequencesCheck.explanations.forEach(exp => detectedPatterns.push(exp));
      suggestions.push('Remove sequential numbers, keypad lines (e.g. "qwerty") or alphabets. Attack databases look for keys in proximity.');
    }
    if (dictionaryCheck.matched && dictionaryCheck.matchWord) {
      detectedPatterns.push(`Matched known dictionary root word: "${dictionaryCheck.matchWord}"`);
      suggestions.push(`Avoid using common dictionary terminology like "${dictionaryCheck.matchWord}". Try concatenating multiple words instead (passphrase).`);
    }
    if (commonLeakCheck.matched) {
      detectedPatterns.push('WARNING: Password resides directly inside known leaked databases!');
      suggestions.push('Critical replacement needed: This credential has been leaked publicly millions of times. It is unusable for production security.');
    }
  }

  // Crack speed estimate
  const crackTime = estimateCrackingTime(sanitized, entropyInfo.poolSize, entropyInfo.entropy);

  const durationMs = performance.now() - startTime;

  return {
    score,
    entropy: entropyInfo.entropy,
    strength: entropyInfo.category,
    checks: {
      length: isLengthValid,
      uppercase: isUppercaseValid,
      lowercase: isLowercaseValid,
      number: isNumberValid,
      special: isSpecialValid,
      noSequence,
      noRepeated,
      noCommon,
      noDictionary
    },
    detectedPatterns,
    suggestions: suggestions.slice(0, 5), // Return top 5 suggestions only to keep screen balanced
    crackTime,
    analysisTimeMs: parseFloat(durationMs.toFixed(3))
  };
}
