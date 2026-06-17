/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type StrengthCategory = 'VERY_WEAK' | 'WEAK' | 'FAIR' | 'STRONG' | 'VERY_STRONG' | 'EXCELLENT';

export interface RuleCheck {
  id: string;
  label: string;
  passed: boolean;
  required: boolean;
}

export interface CrackingEstimation {
  onlineThrottled: string;    // e.g. "100 years"
  onlineUnthrottled: string;  // e.g. "5 days"
  offlineFastGPU: string;     // e.g. "2 seconds"
  dictionaryAttack: string;
}

export interface AnalysisResult {
  score: number;              // 0 to 100
  entropy: number;            // in bits
  strength: StrengthCategory;
  checks: {
    length: boolean;          // 8 to 128
    uppercase: boolean;
    lowercase: boolean;
    number: boolean;
    special: boolean;
    noSequence: boolean;      // no "123456" "abcdef" "qwerty"
    noRepeated: boolean;      // no "aaaa" "ababab"
    noCommon: boolean;        // not in top weak list
    noDictionary: boolean;    // no standard words
  };
  detectedPatterns: string[]; // List of visual feedback explanations
  suggestions: string[];      // Actionable secure recommendations
  crackTime: CrackingEstimation;
  analysisTimeMs: number;     // Performance metric
}

export interface PasswordHistoryItem {
  timestamp: number;
  strength: StrengthCategory;
  score: number;
  breachedCount: number | null; // Null means not checked
}

export interface GeneratorOptions {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
  excludeSimilar: boolean; // e.g. i, l, 1, o, 0, O
  excludeAmbiguous: boolean; // e.g. { } [ ] ( ) / \ ' " ` ~ , ; : . < >
}

export interface SecurityPolicy {
  minLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSymbols: boolean;
  banSequential: boolean;
  banRepeats: boolean;
  banCommon: boolean;
}
