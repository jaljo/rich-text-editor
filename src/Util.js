import React from 'react'
import urlParse from 'url-parse'
import {
  __,
  addIndex,
  always,
  and,
  anyPass,
  append,
  apply,
  both,
  complement,
  compose,
  concat,
  cond,
  contains,
  defaultTo,
  divide,
  drop,
  dropLast,
  equals,
  evolve,
  F,
  find,
  findIndex,
  has,
  identity,
  ifElse,
  intersection,
  is,
  isEmpty,
  isNil,
  join,
  keysIn,
  length,
  lensPath,
  map,
  mapObjIndexed,
  match,
  not,
  nth,
  omit,
  or,
  pipe,
  prop,
  propEq,
  propOr,
  propSatisfies,
  reduce,
  reject,
  remove,
  replace,
  split,
  splitAt,
  T,
  tap,
  test,
  toLower,
  toPairs,
  trim,
  uncurryN,
  update,
  view,
  when,
} from 'ramda'
import { Observable } from 'rxjs'
import pathToRegexp from 'path-to-regexp'
import { merge, catchError } from 'rxjs/operators'
import Logger from './Logger'
import defaultImage from './Image/default_image.jpg'
import defaultProfile from './Image/default_profile.png'
import { of } from 'rxjs'

/**
 * Redux Utils
 */

// createReducer :: (State, Object) -> (State, Action) -> State
export const createReducer = (initialState, handlers) =>
  (state = initialState, action = {}) =>
    propOr(identity, prop('type', action), handlers)(state, action)

/**
 * Date Utils
 */
// addHour :: Int -> Date -> Date
export const addHour = hour => date =>
  new Date(date.getTime() + parseInt(hour, 10) * 60 * 60 * 1000)

// Set the given hour for the given date according to local time
// @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/setHours
// setHour :: Int -> Date -> Date
export const setHour = hour => date =>
  new Date((new Date(date)).setHours(hour))

// Set the given minute for the given date according to local time
// @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/setHours
// setMinute :: Int -> Date -> Date
export const setMinute = minute => date =>
  new Date((new Date(date)).setHours(date.getHours(), minute))

// diffAsHours :: (Date, Date) -> Number
export const diffAsHours = (startDate, endDate) =>
  Math.ceil((endDate.getTime() - startDate.getTime()) / (60 * 60 * 1000))

// Given a locale and an ISO date string, returns a human readable date
// @example with 'en' locale : 01/31/2018
// @example with 'fr' locale : 31/01/2018
// formatDate :: String -> String
export const formatDate = isoString =>
  (new Date(isoString))
  .toLocaleDateString(navigator.language)

// formatTime :: String -> String
export const formatTime = isoString =>
  (new Date(isoString))
  .toLocaleTimeString(navigator.language, {
    hour: "2-digit",
    minute: "2-digit",
  })

// formatDateTime :: String -> String
export const formatDateTime = isoString =>
  (new Date(isoString))
  .toLocaleString(navigator.language, {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })

// toComputerDate :: Date -> String
export const toComputerDate = date => join('-', [
  date.getFullYear(),
  String(date.getMonth() + 1).padStart(2, '0'),
  String(date.getDate()).padStart(2, '0'),
])

// toComputerTime :: Date -> String
export const toComputerTime = date => join(':', [
  String(date.getHours()).padStart(2, '0'),
  String(date.getMinutes()).padStart(2, '0'),
])

/**
 * Location / Url utils
 *
 * @type Location {
 *   hash :: String,
 *   host :: String,
 *   hostname :: String,
 *   href :: String,
 *   origin :: String,
 *   port :: String,
 *   protocal :: String,
 *   search :: String
 * }
 *
 * @type QueriedLocation {
 *   hash :: String,
 *   host :: String,
 *   hostname :: String,
 *   href :: String,
 *   origin :: String,
 *   port :: String,
 *   protocal :: String,
 *   query :: String
 * }
 */

// replaceKeyQueryBySearch :: QueriedLocation -> Location
export const replaceKeyQueryBySearch = queriedLocation => ({
  ...omit(['query'], queriedLocation),
  search: queriedLocation.query,
})

// urlToLocation :: QueriedLocation -> Location
export const urlToLocation = compose(replaceKeyQueryBySearch, urlParse)

// routeMatch :: String -> Route -> Boolean
export const routeMatch = uncurryN(2, path => pipe(
  prop('pattern'),
  pattern => pathToRegexp(pattern).exec(path),
  complement(isNil),
))

// routeParameters :: String -> Route -> Object
export const routeParameters = uncurryN(2, path => pipe(
  route => {
    let keys = [];
    let result = pathToRegexp(route.pattern, keys).exec(path);

    return [keys, route, result ? drop(1, result) : []];
  },
  ifElse(
    compose(routeMatch(path), nth(1)),
    ([ keys, route, result ]) => addIndex(map)((value, i) => [
      keys[i].name,
      value,
    ])(result),
    always([]),
  ),
  reduce((params, [ key, value ]) => ({
    ...params,
    [key]: value,
  }), {}),
))

// hasRouteName :: [String] -> [Match] -> Boolean
export const hasRouteName = names => pipe(
  map(prop('name')),
  intersection(names),
  isEmpty,
  not,
)

/**
 * History utils
 */

// listenWhenHistoryPop :: History -> Observable Location
export const listenWhenHistoryPop = history => Observable.create(observer =>
  history.listen((location, action) => action === 'POP' && observer.next(location)))

/**
 * Observables utils
 */
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

/**
 * API utils
 */

// jsonStringify :: Object -> String
export const jsonStringify = data => JSON.stringify(data)

// then :: (a -> b) -> Promise a e -> Promise b f
export const then = handler => promise => promise.then(handler)

/**
 * fetchApi :: (Function -> Promise, Object) -> (String, Object) -> Promise fetch.Response Error
 */
export const fetchApi = (fetcher, cookies) => (resource, options = {}) =>
  fetcher(
    `${process.env.REACT_APP_API_BASE_URL}${resource}`,
    {
      ...options,
      headers: resolveHeaders(cookies.get('adminToken'))(options),
    }
  )
  .then(response => Promise.all([
    response,
    204 === response.status ? null : resolveResponseBody(response),
  ]))
  .then(([response, body]) => response.status < 400
    ? [response, body]
    : Promise.reject(body)
  )
  .then(([response, body]) => ({
    status: response.status,
    body,
    headers: response.headers,
  }))

// defaultHeaders :: String -> Object -> Object
const defaultHeaders = token => headers => Object.assign(
  {
   'Accept': 'application/json',
   'Content-Type': 'application/json',
  },
  token ? { 'Authorization': `Bearer ${token}` } : {},
  headers,
)

// String -> Object -> Object
const resolveHeaders = token => pipe(
  ifElse(
    both(
      has('resetContentType'),
      propEq('resetContentType', true),
    ),
    options => omit(['Content-Type'], defaultHeaders(token)(options.headers)),
    options => defaultHeaders(token)(options.headers),
  ),
)

// isJsonType :: String -> Boolean
const isJsonType = anyPass([
  equals('application/json'),
  equals('application/problem+json'),
])

// resolveResponseBody :: Response -> Promise<string>
const resolveResponseBody = response =>
  isJsonType(String(response.headers.get('Content-Type')).toLowerCase())
    ? response.json()
    : response.text()

/**
 * Other utilities
 */

// isEscapeKey :: KeyboardEvent -> Boolean
export const isEscapeKey = ifElse(
  compose(contains('key'), keysIn),
  compose(equals('escape'), toLower, prop('key')),
  F,
)

// emptyToDefault :: String -> String -> String
export const emptyToDefault = defaultValue => ifElse(
  value => isNil(value) || isEmpty(value),
  () => defaultValue,
  identity,
)

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

// formatChildErrors :: Error -> [String]
const formatChildErrors = pipe(
  prop('children'),
  reject(compose(isEmpty, prop('errors'))),
  map(child => `${child.field}: ${join(' ', child.errors)}`),
)

// formatFormErrors :: Error -> [String]
export const formatFormErrors = pipe(
  formErrors => concat(
    [join(' ', formErrors.errors)],
    formatChildErrors(formErrors),
  ),
  reject(isEmpty),
)

// formatError :: Error -> [String]
export const formatErrors = cond([
  [has('errors'), formatFormErrors],
  [has('message'), error => append(error.message, [])],
  [T, error => append(error, [])],
])

// nilToList :: Maybe [Object] -> [Object]
export const nilToList = ifElse(isNil, always([]), identity);

// findById :: Number -> [Object] -> Object
// Given the Object contains an id prop, extract that object from a list
export const findById = uncurryN(2, id => find(propEq('id')(id)))

// removeFrom :: Number -> [Object] -> [Object]
// Given the Object contains an id prop, remove that object from a list
export const removeFrom = uncurryN(2, id => list => remove(
  findIndex(propEq('id', id), list),
  1,
  list,
))

// indexOrLast :: Number -> [Object] -> Number
// Given the Object contains an id prop, return the position of the element
// identified by the provided id OR tha last position in the Object list
export const indexOrLast = uncurryN(2, id => list => ifElse(
  isNil,
  () => length(list),
  () => findIndex(propEq('id', id), list),
)(id))

// updateIn :: Number -> Object -> [Object] -> [Object]
export const updateIn = uncurryN(3, id => newElement => list => update(
  findIndex(propEq('id', id), list),
  newElement,
  list,
))

export const indexedMap = addIndex(map)

// slugify :: String -> String
export const slugify = pipe(
  toLower,
  replace(/[ *+~.()'"!:@]/g, '-'),
)

// onReturn :: Event -> (Action * -> State) -> Action
export const onReturn = actionCreator => ifElse(
  compose(equals(13), prop('charCode')),
  pipe(
    event => [actionCreator(event), event],
    ([action, event]) => event.preventDefault(),
  ),
  identity,
)

// replaceFirstQuestionMark :: String -> String
const replaceFirstQuestionMark = ifElse(
  match(/^\?/),
  drop(1),
  identity,
)
// splitByAmpersand :: String -> [String]
const splitByAmpersand = split('&')
// toKeyValuePair :: [String] -> [[String]]
const toKeyValuePair = map(split('='))
// addArrayResultToRecord :: Dict(String, *) -> [*] -> Dict(Strng, *)
const addArrayResultToRecord = record => ([ key, value ]) => ({
  ...record,
  [keyOfArrayKey(key)]: append(
    formatValue(value),
    valueAtArrayKey(record)(key),
  )
})
// addResultToRecord :: Dict(String, *) -> [*] -> Dict(String, *)
const addResultToRecord = record => ([ key, value ]) => ({
  ...record,
  [key]: value,
})
// reduceKeyValuePair :: Dict(String, *) -> [*] -> Dict(String, *)
const reduceKeyValuePair = record => cond([
  [compose(isArrayKey, nth(0)), addArrayResultToRecord(record)],
  [T, addResultToRecord(record)],
])
// toQueryRecord :: [[String]] -> Dick(String, String)
const toQueryRecord = reduce((record, pairs) => reduceKeyValuePair(record)(pairs), {})
// formatBoolean :: String "true" -> Boolean
// formatBoolean :: String "false" -> Boolean
// formatBoolean :: String -> String
const formatBoolean = compose(cond([
  [equals('true'), always(true)],
  [equals('false'), always(false)],
  [T, identity],
]), compose(trim, toLower))
// isArrayKey :: String -> Boolean
const isArrayKey = test(/\[\]$/)
// keyOfArrayKey :: String -> String
const keyOfArrayKey = dropLast(2)
// valuesAtKeyWithDefault :: Dict(String, *) -> String -> [*]
const valueAtArrayKey = record => pipe(
  keyOfArrayKey,
  propOr([], __, record)
)
// formatValue :: String -> *
const formatValue = pipe(
  ifElse(is(String), formatBoolean, identity),
)
// formatValues :: [[String]] -> [[*]]
const formatValues = map(
  ([ key, value ]) => ([
    key,
    formatValue(value),
  ]),
)
// parseQueryString :: String -> Dict(String, String)
export const parseQueryString = pipe(
  replaceFirstQuestionMark,
  splitByAmpersand,
  toKeyValuePair,
  formatValues,
  toQueryRecord,
)

// gatherMetadata :: (State.EditionBar, String, String) -> Object
export const gatherMetadata = (state, title = '', excerpt = '') => ({
  category: state.category,
  shortTitle: ellipsis255(state.shortTitle),
  metaTitle: ellipsis255(state.metaTitle || title),
  metaDescription: ellipsis255(state.metaDescription || excerpt),
  status: state.status,
})

/**
 * Image utilities
 */

// getAcceptedImageTypes :: [String]
export const getAcceptedImageTypes = always([
 'image/jpeg',
 'image/png',
])

// getHumanReadableAcceptedImageTypes :: () -> [String]
export const getHumanReadableAcceptedImageTypes = pipe(
  getAcceptedImageTypes,
  map(replace('image/', '')),
)

// getMaxFileSize :: () -> Int
export const getMaxFileSize = always(2000000)

// @TEMP getImagePath :: String -> String
// this temporary function lifts differences between local and preprod contexts for image loading
// it has to be removed when the image upload will be normalized to use the CDN
export const getImagePath = cond([
  [contains('http://api.preprod.i24news.org'), replace('http://api.preprod.i24news.org', 'https://api.preprod.i24news.org')],
  [T, identity],
])

// renderProfileImage :: (Image, Object) -> React.Component
export const renderProfileImage = (image, attributes = {}) =>
  isNil(image)
    ? renderPlaceholder(attributes, defaultProfile)
    : renderValidImage(image, attributes)

// renderImage :: (Image, Object) -> React.Component
export const renderImage = (image, attributes = {}) =>
  isNil(image)
    ? renderPlaceholder(attributes)
    : renderValidImage(image, attributes)

// renderValidImage :: (Image, Object) -> React.Component
export const renderValidImage = (image, attributes = {}) =>
  <div className="cover-container">
    <img
      src={ getImagePath(image.href) }
      alt={ image.legend }
      className={ attributes.className || '' }
      onClick={ attributes.onClick || F }
    />
    { attributes.withCredits && <figcaption className="credit">{ image.credit}</figcaption> }
  </div>

// renderPlaceholder :: (Maybe Object, Image) -> React.Component
export const renderPlaceholder = (attributes = {}, image = defaultImage) =>
  <img
    src={ image }
    alt={ attributes.alt || 'Default profile' }
    className={ attributes.className || '' }
    onClick={ attributes.onClick || F }
  />

// renderCaption :: (String, Image) -> String
export const renderCaption = (coverCaption, image) =>
  or(isNil(coverCaption), isEmpty(coverCaption))
  ? propOr('', 'legend', image)
  : coverCaption

// half :: Int -> Float
const half = divide(__, 2)

// findMedianIndex :: [Image] -> Int
const findSplitIndex = compose(Math.round, half, length)

// splitMedias :: [Image|Video] -> [[Image|Video], [Image|Video]]
export const splitMedias = pipe(
  images => [findSplitIndex(images), images],
  apply(splitAt),
)

// containsTenItems :: Maybe [Image|Video] -> Boolean
export const containsTenItems = both(
  complement(isNil),
  compose(equals(10), length),
)

/**
 * String utilities
 *
 * strShorten :: String -> Number -> String
 */
export const strShorten = uncurryN(2, str => length => `${str.substr(0, length)}...`)

// getTextFromHTML :: String -> String
export const getTextFromHTML = body => pipe(
  tap(div => div.innerHTML = body),
  ifElse(
    propSatisfies(isNil, 'textContent'),
    prop('innerText'),
    prop('textContent'),
  ),
  defaultTo(''),
)(document.createElement('div'))

const buildEllipsis = length => pipe(
  split(' '),
  reduce(
    // "+1" is to check for space
    (acc, current) => acc.length + current.length + 1 < length
      ? join(' ', [acc, current])
      : acc,
    '',
  ),
  reduced => join(' ', [reduced, '…']),
  trim,
)

// ellipsis :: Number => String => String
export const ellipsis = length => text => ifElse(
  () => length <= 2, // space + ellipsis char
  () => '…',
  ifElse(
    trimmedText => trimmedText.length <= length,
    identity,
    buildEllipsis(length),
  ),
)(trim(text || ''))

// ellipsis255 :: String -> String
export const ellipsis255 = ellipsis(255)

/**
 * List utilities
 */

 // hide -> [Object] -> [Object]
 export const hideObjects = mapObjIndexed(
   evolve({ visible: always(false) })
 )

// getOppositeSortDirection :: String -> String
export const getOppositeSortDirection = dir =>
  toLower(String(dir)) === 'desc'
    ? 'asc'
    : 'desc'

// getSortQueryString :: Object -> String
export const getSortQueryString = sort => {
  const name = Object.keys(sort)[0];
  const direction = sort[name];

  return 'desc' === direction
    ? `-${name}`
    : name
}

// isTarget :: (Boolean, Number, Number) -> Boolean
export const isTarget = (targetOpened, currentId, id) => and(
  targetOpened,
  equals(currentId, id),
)

// refreshPagination :: (Number, Number, Number) -> Object
export const refreshPagination = (totalCount, limit, currentPage) => ({
  first: 1,
  current: currentPage,
  last: Math.ceil(divide(totalCount, limit)),
})

/**
 * Translation utilities
 */

export const translate = dictionary => locale => (path, params = {}) => pipe(
  getMemberAtPath(dictionary, path),
  replaceParams(params),
)(locale)

const getMemberAtPath = (dictionary, path) => pipe(
  getDictionaryForLocale(dictionary),
  view(lensPath(split('.', path))),
  defaultTo(''),
)

const getDictionaryForLocale = dictionary => cond([
  [test(/^fr/i), always(dictionary['french'] || dictionary['fr'])],
  [test(/^ar/i), always(dictionary['arabic'] || dictionary['ar'])],
  [T, always(dictionary['english'] || dictionary['en'])],
])

const replaceParams = params => subject => reduce(
  replaceParam,
  subject,
  toPairs(params),
)

const replaceParam = (subject, [name, value]) => replace(
  new RegExp(`{[ ]*${name}[ ]*}`, 'g'),
  value,
  subject,
)

// rtlClass :: String -> String -> String
export const rtlClass = locale => (className = '') =>
  `${className} ${'ar' === locale ? 'rtl': ''}`

/**
 * DOM utilities
 */

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

// getEditor :: String -> Node
export const getEditor = editorName => document.querySelector(
  `.edited-text-root[data-editor-name="${editorName}"]`
)
