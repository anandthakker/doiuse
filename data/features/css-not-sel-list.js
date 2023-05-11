/**
 * TODO: initially implement selector list argument of :not()
 * Selectors Level 3 only allowed `:not()` pseudo-class to accept a single simple selector, which the element must not match any of. Thus, `:not(a, .b, [c])` or `:not(a.b[c])` did not work. Selectors Level 4 allows `:not()` to accept a list of selectors. Thus, `:not(a):not(.b):not([c])` can instead be written as `:not(a, .b, [c])` and `:not(a.b[c])` works as intended.
 *
 * See: https://caniuse.com/css-not-sel-list
 */

/**
 * @type {import('../features').Feature}
 */
export default {};