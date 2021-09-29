import {
  bind,
  partial,
} from 'ramda'

/**
 * This is a custom logger used for development purpose. If you have
 * any kind of log to do, please put functions here.
 */

const loggerHead = type => `[${(new Date()).toISOString()}] ${type.toUpperCase()}: `

export const info = partial(
  bind(console.info, console),
  [loggerHead('INFO')],
)

export const error = partial(
  bind(console.error, console),
  [loggerHead('ERROR')],
)

export const warn = partial(
  bind(console.warn, console),
  [loggerHead('WARNING')],
)

export const log = partial(
  bind(console.log, console),
  [loggerHead('LOG')],
)

const Logger = {
  error,
  info,
  log,
  warn,
};

export default Logger
