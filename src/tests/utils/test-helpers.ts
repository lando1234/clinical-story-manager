/**
 * Test Helpers - Utility functions for test assertions and data manipulation
 *
 * Provides type-safe assertion helpers for Result types and date utilities.
 */

import { expect } from "vitest";
import { Result, DomainError, DomainErrorCode } from "@/types/errors";

// =============================================================================
// DATE UTILITIES
// =============================================================================

/**
 * Returns a Date object for N days ago from today.
 */
export function daysAgo(n: number): Date {
  const date = new Date();
  date.setDate(date.getDate() - n);
  date.setHours(0, 0, 0, 0);
  return date;
}

/**
 * Returns a Date object for N days from today.
 */
export function daysFromNow(n: number): Date {
  const date = new Date();
  date.setDate(date.getDate() + n);
  date.setHours(0, 0, 0, 0);
  return date;
}

/**
 * Returns a Date object for N weeks ago from today.
 */
export function weeksAgo(n: number): Date {
  return daysAgo(n * 7);
}

/**
 * Returns a Date object for N months ago from today.
 */
export function monthsAgo(n: number): Date {
  const date = new Date();
  date.setMonth(date.getMonth() - n);
  date.setHours(0, 0, 0, 0);
  return date;
}

/**
 * Returns a Date object for N years ago from today.
 */
export function yearsAgo(n: number): Date {
  const date = new Date();
  date.setFullYear(date.getFullYear() - n);
  date.setHours(0, 0, 0, 0);
  return date;
}

/**
 * Returns today's date at midnight.
 */
export function today(): Date {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
}

/**
 * Returns yesterday's date at midnight.
 */
export function yesterday(): Date {
  return daysAgo(1);
}

/**
 * Returns tomorrow's date at midnight.
 */
export function tomorrow(): Date {
  return daysFromNow(1);
}

/**
 * Compares two dates ignoring time component.
 */
export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

/**
 * Returns end of day (23:59:59.999) for a given date.
 */
export function endOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

/**
 * Returns start of day (00:00:00.000) for a given date.
 */
export function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

// =============================================================================
// RESULT TYPE ASSERTIONS
// =============================================================================

/**
 * Asserts that a Result is successful and returns the data.
 * Throws a descriptive error if the result is a failure.
 */
export function assertResultOk<T>(result: Result<T>): T {
  if (!result.success) {
    throw new Error(
      `Expected Result.ok but got Result.err: [${result.error.code}] ${result.error.message}`
    );
  }
  return result.data;
}

/**
 * Asserts that a Result is a failure and returns the error.
 * Throws a descriptive error if the result is successful.
 */
export function assertResultErr(result: Result<unknown>): DomainError {
  if (result.success) {
    throw new Error(
      `Expected Result.err but got Result.ok: ${JSON.stringify(result.data)}`
    );
  }
  return result.error;
}

/**
 * Asserts that a Result is a failure with a specific error code.
 */
export function assertResultErrCode(
  result: Result<unknown>,
  expectedCode: DomainErrorCode
): DomainError {
  const error = assertResultErr(result);
  expect(error.code).toBe(expectedCode);
  return error;
}

/**
 * Type guard to check if a Result is successful.
 */
export function isResultOk<T>(result: Result<T>): result is { success: true; data: T } {
  return result.success;
}

/**
 * Type guard to check if a Result is a failure.
 */
export function isResultErr<T>(result: Result<T>): result is { success: false; error: DomainError } {
  return !result.success;
}

// =============================================================================
// ARRAY UTILITIES
// =============================================================================

/**
 * Asserts that an array is sorted in ascending order by a key function.
 */
export function assertSortedAscending<T>(
  array: T[],
  keyFn: (item: T) => number | Date
): void {
  for (let i = 1; i < array.length; i++) {
    const prev = keyFn(array[i - 1]);
    const curr = keyFn(array[i]);
    const prevValue = prev instanceof Date ? prev.getTime() : prev;
    const currValue = curr instanceof Date ? curr.getTime() : curr;
    expect(prevValue).toBeLessThanOrEqual(currValue);
  }
}

/**
 * Asserts that an array is sorted in descending order by a key function.
 */
export function assertSortedDescending<T>(
  array: T[],
  keyFn: (item: T) => number | Date
): void {
  for (let i = 1; i < array.length; i++) {
    const prev = keyFn(array[i - 1]);
    const curr = keyFn(array[i]);
    const prevValue = prev instanceof Date ? prev.getTime() : prev;
    const currValue = curr instanceof Date ? curr.getTime() : curr;
    expect(prevValue).toBeGreaterThanOrEqual(currValue);
  }
}

/**
 * Extracts identifiers from an array of objects with an id property.
 */
export function extractIds<T extends { id: string }>(items: T[]): string[] {
  return items.map((item) => item.id);
}

// =============================================================================
// WAIT UTILITIES
// =============================================================================

/**
 * Waits for a specified number of milliseconds.
 * Useful for testing timestamp differences.
 */
export function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Waits for a short duration to ensure different timestamps.
 * Default is 10ms.
 */
export function waitForTimestampDifference(ms: number = 10): Promise<void> {
  return wait(ms);
}
