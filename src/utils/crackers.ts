/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CrackingEstimation } from '../types';

/**
 * Formats a duration in seconds into a human-readable estimate
 */
function formatDuration(seconds: number): string {
  if (seconds < 0.001) return 'Sub-millisecond (Instant)';
  if (seconds < 1) return 'Instant (< 1 second)';
  
  const minutes = seconds / 60;
  if (minutes < 1) return `${Math.round(seconds)} seconds`;
  
  const hours = minutes / 60;
  if (hours < 1) return `${Math.round(minutes)} minutes`;
  
  const days = hours / 24;
  if (days < 1) return `${Math.round(hours)} hours`;
  
  const months = days / 30.44;
  if (months < 1) return `${Math.round(days)} days`;
  
  const years = days / 365.25;
  if (years < 1) return `${Math.round(months)} months`;
  
  if (years < 100) return `${Math.round(years)} years`;
  if (years < 100000) return `${Math.round(years / 100) * 100} years`;
  if (years < 10000000) return `${Math.round(years / 1000)} Thousand Years`;
  if (years < 1000000000) return `${Math.round(years / 1000000)} Million Years`;
  return `${Math.round(years / 1000000000)} Billion Years`;
}

/**
 * Estimates cracking times under various realistic scenarios.
 * poolSize ^ length is our search space size (S). On average, 50% search space coverage is needed (S / 2).
 */
export function estimateCrackingTime(password: string, poolSize: number, entropy: number): CrackingEstimation {
  if (!password) {
    return {
      onlineThrottled: 'Instant',
      onlineUnthrottled: 'Instant',
      offlineFastGPU: 'Instant',
      dictionaryAttack: 'Instant'
    };
  }

  // Calculate total search-space size: $2^\text{entropy}$
  const searchSpace = Math.pow(2, entropy);
  const averageGuesses = searchSpace / 2;

  // 1. Online Attack Throttled: ~10 attempts/sec (typical safe login limits, lockouts, or capchas)
  const onlineSlowRate = 10;
  const onlineThrottledSeconds = averageGuesses / onlineSlowRate;

  // 2. Online Attack Unthrottled: ~10,000 attempts/sec (poorly configured REST API)
  const onlineFastRate = 10000;
  const onlineUnthrottledSeconds = averageGuesses / onlineFastRate;

  // 3. Offline Fast GPU Attack: ~100 Billion attempts/sec (typical of a multi-board RTG 4090 Hashcat cluster)
  const gpuRate = 100000000000;
  const offlineFastGPUSeconds = averageGuesses / gpuRate;

  // 4. Dictionary / Smart Brute Force
  // If the password is extremely simple, dictionary attack is instant. 
  // Otherwise, if any words are present, it takes much less time.
  const lowercasePass = password.toLowerCase();
  let dictionarySeconds = onlineUnthrottledSeconds;
  
  if (password.length < 6 || /^[a-zA-Z]+$/.test(password) && password.length < 8) {
    dictionarySeconds = 0.5; // Quick lookup
  } else if (/^[0-9]+$/.test(password)) {
    dictionarySeconds = 1; // Direct keypad scan
  }

  return {
    onlineThrottled: formatDuration(onlineThrottledSeconds),
    onlineUnthrottled: formatDuration(onlineUnthrottledSeconds),
    offlineFastGPU: formatDuration(offlineFastGPUSeconds),
    dictionaryAttack: formatDuration(dictionarySeconds)
  };
}
