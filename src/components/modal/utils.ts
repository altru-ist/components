/**
 * @fileoverview Utility functions and classes for the modal system.
 * This module provides helper functions, error handling, and the PromisedValue class.
 *
 * Key exports:
 * - `PromisedValue` - Promise-like class that can be manually resolved/rejected
 * - `uuid()` - Generates unique identifiers for modals
 * - `after()` - Creates delays for animations and timing
 * - `fail()` - Error throwing utility
 * - Type utilities for TypeScript
 *
 * @module utils
 */

/**
 * Generic constructor type for classes.
 * @template T - The type that the constructor creates (defaults to object)
 */
export type Constructor<T = object> = new (...args: any[]) => T;

/**
 * Type alias for function arguments array.
 * Used in dynamic function calls and constructor parameters.
 */
export type ClosureArgs = any[];

/**
 * Gets the global object in a cross-platform way.
 * Works in both Node.js (globalThis) and browser (window) environments.
 *
 * @template T - The expected type of the global object
 * @returns {T} The global object cast to the specified type
 */

export function runtimeGlobal<T = any>(): T {
  return typeof globalThis !== "undefined" ? (globalThis as T) : (window as T);
}

/**
 * Options interface for JSError constructor.
 * @interface JSErrorOptions
 * @property {unknown} [cause] - The underlying cause of the error
 */
export interface JSErrorOptions {
  cause?: unknown;
}

/**
 * Reference to the global Error class from the runtime environment.
 * @type {typeof Error}
 */
export const RuntimeErrorClass = runtimeGlobal<typeof globalThis>().Error;

/**
 * Custom error class that properly extends the native Error class.
 * Fixes common inheritance issues with Error in TypeScript/JavaScript.
 *
 * @class JSError
 * @extends {RuntimeErrorClass}
 *
 * @example
 * ```typescript
 * throw new JSError('Something went wrong', { cause: originalError });
 * ```
 */
export default class JSError extends RuntimeErrorClass {
  declare public name: string;
  declare public message: string;
  declare public stack?: string;
  declare public cause?: unknown;

  /**
   * Creates a new JSError instance.
   * @param {string} [message] - The error message
   * @param {JSErrorOptions} [options] - Additional error options
   */
  constructor(message?: string, options?: JSErrorOptions) {
    super(...([message, options] as ClosureArgs));

    // Fix inheritance: https://stackoverflow.com/questions/41102060/typescript-extending-error-class
    this.name = new.target.name === "JSError" ? "Error" : new.target.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Throws an error with the given message.
 * @template T - The return type (never actually returns)
 * @param {string} [message] - The error message
 * @returns {T} Never returns, always throws
 * @throws {Error} Always throws an Error with the given message
 */
export function fail<T = any>(message?: string): T;

/**
 * Throws an error using a custom error class.
 * @template T - The return type (never actually returns)
 * @template E - The error class type
 * @param {Constructor<E>} [errorClass] - The error class to instantiate
 * @param {...ConstructorParameters<Constructor<E>>} params - Parameters for the error constructor
 * @returns {T} Never returns, always throws
 * @throws {E} Always throws an instance of the specified error class
 */
export function fail<T = any, E extends Error = Error>(
  errorClass?: Constructor<E>,
  ...params: ConstructorParameters<Constructor<E>>
): T;

/**
 * Throws a JSError with custom parameters.
 * @template T - The return type (never actually returns)
 * @template E - The JSError class type
 * @param {Constructor<E>} [errorClass] - The JSError class to instantiate
 * @param {...ConstructorParameters<Constructor<E>>} params - Parameters for the error constructor
 * @returns {T} Never returns, always throws
 * @throws {E} Always throws an instance of the specified JSError class
 */
export function fail<T = any, E extends JSError = JSError>(
  errorClass?: Constructor<E>,
  ...params: ConstructorParameters<Constructor<E>>
): T;

/**
 * Utility function that always throws an error. Used for error-first programming patterns.
 * Can throw either a simple Error with a message or a custom error class with parameters.
 *
 * @param {string | Constructor<Error>} [messageOrClass='Something went wrong'] - Either an error message or error class
 * @param {...any[]} params - Additional parameters for custom error classes
 * @returns {any} Never returns, always throws
 * @throws {Error} Throws either Error or the specified error class
 *
 * @example
 * ```typescript
 * // Throw with message
 * const value = someCondition ? 'valid' : fail('Invalid condition');
 *
 * // Throw custom error
 * const result = hasPermission ? data : fail(UnauthorizedError, 'Access denied');
 * ```
 */
export function fail(
  messageOrClass: string | Constructor<Error> = "Something went wrong",
  ...params: any[]
): any {
  const errorClass =
    typeof messageOrClass === "string" ? Error : messageOrClass;

  throw new errorClass(
    ...(typeof messageOrClass === "string" ? [messageOrClass] : params),
  );
}

/**
 * Options for the after function timeout configuration.
 * @interface AfterOptions
 * @property {number} [ms] - Milliseconds to wait
 * @property {number} [milliseconds] - Alias for ms
 * @property {number} [s] - Seconds to wait
 * @property {number} [seconds] - Alias for s
 */
export interface AfterOptions {
  ms?: number;
  milliseconds?: number;
  s?: number;
  seconds?: number;
}

/**
 * Wait for a specified number of milliseconds.
 * @param {number} ms - Number of milliseconds to wait
 * @returns {Promise<void>} Promise that resolves after the specified time
 */
export function after(ms: number): Promise<void>;

/**
 * Wait for a specified time using configuration options.
 * @param {AfterOptions} [options] - Time configuration options
 * @returns {Promise<void>} Promise that resolves after the specified time
 */
export function after(options?: AfterOptions): Promise<void>;

/**
 * Creates a promise that resolves after a specified amount of time.
 * Useful for adding delays, animations, or rate limiting.
 *
 * @param {number | AfterOptions} [msOrOptions={}] - Either milliseconds as number or options object
 * @returns {Promise<void>} Promise that resolves after the specified time
 *
 * @example
 * ```typescript
 * // Wait 1 second
 * await after(1000);
 *
 * // Wait using options
 * await after({ seconds: 2, milliseconds: 500 }); // 2.5 seconds
 *
 * // Use in modal closing
 * modal.close();
 * await after(300); // Wait for animation
 * modal.remove();
 * ```
 */
export function after(msOrOptions: number | AfterOptions = {}): Promise<void> {
  const time =
    typeof msOrOptions === "number"
      ? msOrOptions
      : (msOrOptions.milliseconds || msOrOptions.ms || 0) +
        (msOrOptions.seconds || 0) * 1000;

  return new Promise((resolve) => setTimeout(resolve, time));
}

/**
 * Type alias for a generic object with string keys and unknown values.
 * @typedef {Record<string, unknown>} Obj
 */
export type Obj = Record<string, unknown>;

/**
 * Checks if a value is an object (not null, not array, not function).
 * @param {unknown} value - The value to check
 * @returns {value is Obj} True if the value is an object
 *
 * @example
 * ```typescript
 * isObject({}); // true
 * isObject(null); // false
 * isObject([]); // true (arrays are objects)
 * isObject('string'); // false
 * ```
 */
export function isObject(value: unknown): value is Obj {
  return typeof value === "object" && value !== null;
}

/**
 * Checks if a value is a plain object (created with {} or new Object()).
 * Excludes arrays, functions, dates, and other special objects.
 *
 * @param {unknown} value - The value to check
 * @returns {value is object} True if the value is a plain object
 *
 * @example
 * ```typescript
 * isPlainObject({}); // true
 * isPlainObject(new Object()); // true
 * isPlainObject([]); // false
 * isPlainObject(new Date()); // false
 * isPlainObject(null); // false
 * ```
 */
export function isPlainObject(value: unknown): value is object {
  return isObject(value) && Object.getPrototypeOf(value) === Object.prototype;
}

/**
 * Type-level utility to check if a type is a plain object.
 * Returns true for plain objects, false for functions, arrays, dates, etc.
 *
 * @template T - The type to check
 * @typedef {boolean} IsPlainObject
 */
export type IsPlainObject<T> = T extends object
  ? T extends (...args: any[]) => any
    ? false
    : T extends any[]
      ? false
      : T extends Date
        ? false
        : T extends RegExp
          ? false
          : true
  : false;

/**
 * Generates a random hexadecimal digit for UUID creation.
 * @private
 * @param {string} seed - The seed character from the UUID template
 * @returns {string} A random hexadecimal digit
 */
function randomHexadecimalDigit(seed: string): string {
  const s = seed as unknown as number;

  return (s ^ ((Math.random() * 16) >> (s / 4))).toString(16);
}

/**
 * Generates a UUID v4 string.
 * Creates a universally unique identifier suitable for use as modal IDs.
 *
 * @returns {string} A UUID v4 string in the format xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
 *
 * @example
 * ```typescript
 * const id = uuid(); // '550e8400-e29b-41d4-a716-446655440000'
 * const modal = createModal(MyComponent);
 * console.log(modal.id); // Uses uuid() internally
 * ```
 */
export function uuid(): string {
  return ("" + 1e7 + -1e3 + -4e3 + -8e3 + -1e11).replace(
    /[018]/g,
    randomHexadecimalDigit,
  );
}

/**
 * Type utility that creates a "prettier" version of a type by expanding it.
 * Useful for making complex intersection types more readable in IDE tooltips.
 *
 * @template T - The type to make prettier
 * @typedef {Object} Pretty
 */
export type Pretty<T> = T extends infer U ? { [K in keyof U]: U[K] } : never;

/**
 * Type utility to check if a type is `any`.
 * Returns true if T is the `any` type, false otherwise.
 *
 * @template T - The type to check
 * @typedef {boolean} IsAny
 */
export type IsAny<T> = { __: "never" } extends T ? true : false;

/**
 * Listener function type for when a PromisedValue resolves.
 * @template T - The type of the resolved value
 * @callback PromisedValueResolveListener
 * @param {T} result - The resolved value
 * @returns {unknown} Optional return value
 */
export type PromisedValueResolveListener<T> = (result: T) => unknown;

/**
 * Listener function type for when a PromisedValue rejects.
 * @callback PromisedValueRejectListener
 * @param {Error} [reason] - The rejection reason
 * @returns {unknown} Optional return value
 */
export type PromisedValueRejectListener = (reason?: Error) => unknown;

/**
 * Listener function type for when a PromisedValue resets.
 * @callback PromisedValueResetListener
 * @returns {unknown} Optional return value
 */
export type PromisedValueResetListener = () => unknown;

/**
 * A Promise-like class that can be manually resolved or rejected.
 * Provides additional functionality like listeners, reset capability, and value access.
 * Used internally by the modal system to handle modal responses.
 *
 * @template T - The type of value this promise will resolve to
 * @implements {Promise<T>}
 *
 * @example
 * ```typescript
 * const promisedValue = new PromisedValue<string>();
 *
 * // Set up listeners
 * promisedValue.onResolve(value => console.log('Resolved:', value));
 *
 * // Resolve later
 * promisedValue.resolve('Hello World');
 *
 * // Use as a regular promise
 * const result = await promisedValue;
 * ```
 */
export class PromisedValue<T = unknown> implements Promise<T> {
  /**
   * Creates a PromisedValue from an existing Promise.
   * The PromisedValue will resolve or reject when the source promise does.
   *
   * @template T - The type of value the promise resolves to
   * @param {Promise<T>} promise - The source promise
   * @returns {PromisedValue<T>} A new PromisedValue that mirrors the source promise
   *
   * @example
   * ```typescript
   * const fetchPromise = fetch('/api/data');
   * const promisedValue = PromisedValue.from(fetchPromise);
   * ```
   */
  public static from<T>(promise: Promise<T>): PromisedValue<T> {
    const promisedValue = new PromisedValue<T>();

    promise
      .then(promisedValue.resolve.bind(promisedValue))
      .catch(promisedValue.reject.bind(promisedValue));

    return promisedValue;
  }

  declare private _value?: T;
  declare private promise: Promise<T>;
  declare private _resolve: (result: T) => void;
  declare private _reject: (reason?: Error) => void;

  private readonly resolveListeners: PromisedValueResolveListener<T>[] = [];
  private readonly rejectListeners: PromisedValueRejectListener[] = [];
  private readonly resetListeners: PromisedValueResetListener[] = [];

  /**
   * Creates a new PromisedValue instance.
   * The promise starts in a pending state and can be resolved or rejected later.
   */
  constructor() {
    this.setPromiseValues();
  }

  declare public [Symbol.toStringTag]: string;

  /**
   * Gets the resolved value if the promise has been resolved.
   * @returns {T | null} The resolved value or null if not yet resolved
   */
  public get value(): T | null {
    return this._value ?? null;
  }

  /**
   * Type guard to check if the promise has been resolved.
   * @returns {boolean} True if the promise has been resolved
   */
  public isResolved(): this is { value: T } {
    return "_value" in this;
  }

  /**
   * Attaches callbacks for the resolution and/or rejection of the Promise.
   * @template TResult1 - The type of the fulfilled value
   * @template TResult2 - The type of the rejected value
   * @param {Function} [onFulfilled] - Callback for when promise is fulfilled
   * @param {Function} [onRejected] - Callback for when promise is rejected
   * @returns {Promise<TResult1 | TResult2>} A Promise for the completion of the callbacks
   */
  public then<TResult1 = T, TResult2 = never>(
    onFulfilled?:
      | ((value: T) => TResult1 | PromiseLike<TResult1>)
      | undefined
      | null,
    onRejected?:
      | ((reason: Error) => TResult2 | PromiseLike<TResult2>)
      | undefined
      | null,
  ): Promise<TResult1 | TResult2> {
    return this.promise.then(onFulfilled, onRejected);
  }

  /**
   * Attaches a callback for only the rejection of the Promise.
   * @template TResult - The type of the rejected value
   * @param {Function} [onRejected] - Callback for when promise is rejected
   * @returns {Promise<T | TResult>} A Promise for the completion of the callback
   */
  public catch<TResult = never>(
    onRejected?:
      | ((reason: Error) => TResult | PromiseLike<TResult>)
      | undefined
      | null,
  ): Promise<T | TResult> {
    return this.promise.catch(onRejected);
  }

  /**
   * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected).
   * @param {Function} [onFinally] - Callback to run when promise settles
   * @returns {Promise<T>} A Promise for the completion of the callback
   */
  public finally(onFinally?: (() => void) | null): Promise<T> {
    return this.promise.finally(onFinally);
  }

  /**
   * Resolves the promise with the given value.
   * If already resolved, resets and resolves again.
   *
   * @param {T} value - The value to resolve with
   */
  public resolve(value: T): void {
    if (this.isResolved()) {
      this.reset();
    }

    this._value = value;
    this._resolve(value);

    this.resolveListeners.forEach((listener) => listener(value));
  }

  /**
   * Rejects the promise with the given reason.
   * If already resolved, resets and rejects.
   *
   * @param {Error} [reason] - The reason for rejection
   */
  public reject(reason?: Error): void {
    if (this.isResolved()) {
      this.reset();
    }

    delete this._value;
    this._reject(reason);

    this.rejectListeners.forEach((listener) => listener(reason));
  }

  /**
   * Adds a listener for when the promise resolves.
   *
   * @param {PromisedValueResolveListener<T>} listener - Function to call when resolved
   * @returns {Function} Function to remove the listener
   */
  public onResolve(listener: PromisedValueResolveListener<T>): () => void {
    this.resolveListeners.push(listener);

    return () => arrayRemove(this.resolveListeners, listener);
  }

  /**
   * Adds a listener for when the promise rejects.
   *
   * @param {PromisedValueRejectListener} listener - Function to call when rejected
   * @returns {Function} Function to remove the listener
   */
  public onReject(listener: PromisedValueRejectListener): () => void {
    this.rejectListeners.push(listener);

    return () => arrayRemove(this.rejectListeners, listener);
  }

  /**
   * Adds a listener for when the promise is reset.
   *
   * @param {PromisedValueResetListener} listener - Function to call when reset
   * @returns {Function} Function to remove the listener
   */
  public onReset(listener: PromisedValueResetListener): () => void {
    this.resetListeners.push(listener);

    return () => arrayRemove(this.resetListeners, listener);
  }

  /**
   * Resets the promise to a pending state.
   * Creates a new internal promise and notifies reset listeners.
   */
  public reset(): void {
    this.setPromiseValues();

    this.rejectListeners.forEach((listener) => listener());
  }

  /**
   * Sets up the internal promise and resolve/reject functions.
   * @private
   */
  private setPromiseValues(): void {
    this.promise = new Promise((resolve, reject) => {
      this._resolve = resolve;
      this._reject = reject;
    });
  }
}

/**
 * Removes an item from an array by reference.
 * Modifies the original array in place.
 *
 * @template T - The type of items in the array
 * @param {T[]} items - The array to remove from
 * @param {T} item - The item to remove
 * @returns {boolean} True if the item was found and removed, false otherwise
 *
 * @example
 * ```typescript
 * const arr = [1, 2, 3];
 * const removed = arrayRemove(arr, 2); // true
 * console.log(arr); // [1, 3]
 *
 * const notRemoved = arrayRemove(arr, 5); // false
 * ```
 */
export function arrayRemove<T>(items: T[], item: T): boolean {
  const index = items.indexOf(item);

  if (index === -1) return false;

  items.splice(index, 1);

  return true;
}
