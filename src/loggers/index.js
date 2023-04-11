import log4js from 'log4js'

log4js.configure({
    appenders: {
        loggerConsole: { type: 'console' },
        loggerFileWarn: { type: 'file', filename: '../../LOGS/warn.log' },
        loggerFileError: { type: 'file', filename: '../../LOGS/error.log' }
    },
    categories: {
        default: { appenders: ['loggerConsole'], level: 'trace' },
        info: { appenders: ['loggerConsole'], level: 'info' },
        warn: { appenders: ['loggerConsole'], level: 'warn' },
        error: { appenders: ['loggerConsole'], level: 'error' }
    }
})

const loggerInfo = log4js.getLogger('info')
const loggerWarn = log4js.getLogger('warn')
const loggerError = log4js.getLogger('error')

export function logInfo(msj) {
    loggerInfo.info(msj)
}

export function logWarning(msj) {
    loggerWarn.warn(msj)
}

export function logError(msj) {
    loggerError.error(msj)
}