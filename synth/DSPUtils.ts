// Copyright (c) 2012-2024 John Nesky and contributing authors, distributed under the MIT license.

/** For detecting and avoiding float denormals, which have poor performance. */
export const epsilon: number = (1.0e-24);

/**
 * Clamps a number to the range [min, max - 1].
 */
export function clamp(min: number, max: number, val: number): number {
    max = max - 1;
    if (val <= max) {
        if (val >= min) return val;
        else return min;
    } else {
        return max;
    }
}

/**
 * Clamps a floating point value to the closed range [min, max].
 */
export function clampFloat(min: number, max: number, val: number): number {
    if (val < min) return min;
    if (val > max) return max;
    return val;
}

/**
 * Validates that val is in [min, max], throwing an error otherwise.
 */
export function validateRange(min: number, max: number, val: number): number {
    if (min <= val && val <= max) return val;
    throw new Error(`Value ${val} not in range [${min}, ${max}]`);
}

/**
 * Parses a float with a default fallback if NaN.
 */
export function parseFloatWithDefault<T>(s: string, defaultValue: T): number | T {
    let result: number | T = parseFloat(s);
    if (Number.isNaN(result)) result = defaultValue;
    return result;
}

/**
 * Parses an integer with a default fallback if NaN.
 */
export function parseIntWithDefault<T>(s: string, defaultValue: T): number | T {
    let result: number | T = parseInt(s);
    if (Number.isNaN(result)) result = defaultValue;
    return result;
}

/**
 * Finds the nearest power of two greater than or equal to x.
 */
export function fittingPowerOfTwo(x: number): number {
    return Math.pow(2.0, Math.ceil(Math.log2(x)));
}
