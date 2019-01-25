import {
  __,
  addIndex,
  always,
  apply,
  both,
  complement,
  compose,
  contains,
  divide,
  equals,
  evolve,
  F,
  find,
  identity,
  ifElse,
  isNil,
  keysIn,
  length,
  map,
  mapObjIndexed,
  pipe,
  prop,
  propEq,
  propOr,
  splitAt,
  tap,
  toLower,
  uncurryN,
  when,
} from 'ramda'
import { merge, catchError } from 'rxjs/operators'
import Logger from './Logger'
import { of } from 'rxjs'

export const logObservableError = () => catchError((err, source) => pipe(
  tap(Logger.error),
  'node' === window.__APP_ENV__ ? _throw : always(source), // eslint-disable-line
)(err))

export const logObservableErrorAndTriggerAction = action => catchError(
  (err, source) => pipe(
    tap(Logger.error),
    () => of(action(err)).pipe(
      merge(source)
    ),
  )(err)
)

// half :: Int -> Float
const half = divide(__, 2)

// findMedianIndex :: [Image] -> Int
const findSplitIndex = compose(Math.round, half, length)

// splitMedias :: [Image|Video] -> [[Image|Video], [Image|Video]]
export const splitMedias = pipe(
  images => [findSplitIndex(images), images],
  apply(splitAt),
)

// isEscapeKey :: KeyboardEvent -> Boolean
export const isEscapeKey = ifElse(
  compose(contains('key'), keysIn),
  compose(equals('escape'), toLower, prop('key')),
  F,
)

// createReducer :: (State, Object) -> (State, Action) -> State
export const createReducer =
  (initialState, handlers) =>
  (state = initialState, action = {}) =>
  propOr(
    identity,
    prop('type', action),
    handlers
  )(state, action)

// hide -> [Object] -> [Object]
export const hideObjects = mapObjIndexed(
  evolve({ visible: always(false) })
)

// getEditor :: String -> Node
export const getEditor = editorName => document.querySelector(
  `.edited-text-root[data-editor-name="${editorName}"]`
)

export const indexedMap = addIndex(map)

// findById :: Number -> [Object] -> Object
// Given the Object contains an id prop, extract that object from a list
export const findById = uncurryN(2, id => find(propEq('id')(id)))

// closestHavingClass :: Element -> String -> Node|null
// Mimics the https://developer.mozilla.org/en-US/docs/Web/API/Element/closest
// function. As the original function is experimental, we implement it here
// to make it cross-browser (as a polyfill).
export const closestHavingClass = className => element =>
  isNil(element.parentNode)
    ? null
    // 1 === Node.ELEMENT_NODE
    : equals(1, element.parentNode.nodeType) && element.parentNode.classList.contains(className)
      ? element.parentNode
      : closestHavingClass(className)(element.parentNode)

// whenValid :: (* -> Action) -> Element -> Action
export const whenValid = callback => pipe(
  tap(e => e.preventDefault()),
  when(
    e => e.target.checkValidity(),
    pipe(
      e => e.target,
      callback,
    ),
  ),
)

// containsTenItems :: Maybe [Image|Video] -> Boolean
export const containsTenItems = both(
  complement(isNil),
  compose(equals(10), length),
)
