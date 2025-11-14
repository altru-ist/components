/**
 * is a utility function that checks if all elements in an array have unique values for a specific key. This is useful when you want to ensure that there are no duplicate values for a specific attribute in a collection of objects.
 * ::: tip When to use 
 * You should use `uniqueArrayValues` when you have an array of objects and you want to ensure that all objects have a unique value for a specific key. This can be useful in scenarios like validating user input, checking data integrity before performing operations, etc.
 * :::
 * ::: warning When not to use 
 * The `uniqueArrayValues` function is versatile and can be used with arrays of primitive values like numbers or strings. It can also be used with arrays of objects when you need to ensure the uniqueness of certain attributes. However, avoid using it when the uniqueness of the elements or attributes is not a concern for your use case.
 * :::
 * @param array - The array to check for unique values.
 * @param key - The key to use for comparison.
 * @returns True if all values are unique, false otherwise.
 * @example
 * ```vue
<script setup lang="ts">
import { ref } from 'vue';
import { uniqueArrayValues } from '@/utils';

// All ID's are Unique.
const array = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
  { id: 3, name: 'Charlie' },
];

const hasUniqueArrayValues = ref(uniqueArrayValues(array, 'id'));

// All ID's are not unique, two of the same number (1).
const arrayTwo = [
  { id: 1, name: 'Alec' },
  { id: 1, name: 'Jane' },
  { id: 3, name: 'Dave' },
];

const hasDuplicateArrayValues = ref(uniqueArrayValues(array, 'id'));
</script>

<template>
  <p>Is array unique? {{ hasUniqueArrayValues.value }}</p>
  <p>Is arrayTwo unique? {{ duplicateArrayValues.value }}</p>
</template>
```
 * 
 */
export function uniqueArrayValues<T, K extends keyof T>(array: T[], key: K) {
  const uniqueCollection = new Set(array.map((item) => item[key]));
  return [...uniqueCollection].length === array.length;
}

function isObject(input: any): boolean {
  return typeof input === "object" && input !== null;
}

function isArrayLike(input: any): boolean {
  return isObject(input) && typeof input.length === "number";
}

/**
 * Takes any input and guarantees an array back.
 * - Converts array-like objects (e.g. `arguments`, `Set`) to a real array.
 * - Converts `undefined` to an empty array.
 * - Converts any another other, singular value (including `null`, objects and iterables other than `Set`) into an array containing that value.
 * - Ignores input which is already an array.
 * @example
 * ```ts
 * arrayify(undefined)
 * // returns []
 *
 * arrayify(null)
 * // returns [ null ]
 *
 * arrayify(0)
 * // returns [ 0 ]
 *
 * arrayify([ 1, 2 ])
 * // returns [ 1, 2 ]
 *
 * arrayify(new Set([ 1, 2 ]))
 * // returns [ 1, 2 ]
 *
 * function f(){ return arrayify(arguments); }
 * f(1,2,3)
 * // returns [ 1, 2, 3 ]
 * ```
 * @param {*} - The input value to convert to an array
 * @returns {Array}
 */
export function arrayify(input: any): any[] {
  if (Array.isArray(input)) {
    return input;
  } else if (input === undefined) {
    return [];
  } else if (isArrayLike(input) || input instanceof Set) {
    return Array.from(input);
  } else {
    return [input];
  }
}

/**
 * Converts the given argument into an array.
 * @param arg - The argument to be converted.
 * @returns An array containing the argument or the argument itself if it is already an array. If the argument is null, an empty array is returned.
 * @template T - The type of the argument.
 */
export function toArray<T>(arg: T | T[] | null): T[] {
  return Array.isArray(arg) ? arg : arg !== null ? [arg] : [];
}

export default {
  toArray,
  uniqueArrayValues,
  arrayify,
};
