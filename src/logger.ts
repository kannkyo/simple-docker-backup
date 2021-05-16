import debug from 'debug'

/**
 * Logger
 */
export const logger = {
  /** Error logger */
  error: debug('ERR'),

  /** Warning logger */
  warn: debug('WARN'),

  /** Information logger */
  info: debug('INFO'),

  /** Debug logger */
  debug: debug('DEBUG')
}

logger.error.log = console.error.bind(console)
logger.warn.log = console.warn.bind(console)
logger.info.log = console.info.bind(console)
logger.debug.log = console.log.bind(console)
