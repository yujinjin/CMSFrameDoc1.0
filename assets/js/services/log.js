/**
 * 作者：yujinjin9@126.com 
 * 时间：2015-07-07
 * 描述：站点log日志
 */
define(function () {
    var log = {};

    log.levels = {
        DEBUG: 1,
        INFO: 2,
        WARN: 3,
        ERROR: 4,
        FATAL: 5
    };

    if (site.Config && site.Config.isDebug) {
        log.level = log.levels.DEBUG;
    }

    log.log = function (logObject, logLevel) {
        if (!window.console || !window.console.log) {
            return;
        }
        if (logLevel != undefined && logLevel < log.level) {
            return;
        }
        console.log(logObject);
    };

    log.debug = function (logObject) {
        log.log("DEBUG: ", log.levels.DEBUG);
        log.log(logObject, log.levels.DEBUG);
    };

    log.info = function (logObject) {
        log.log("INFO: ", log.levels.INFO);
        log.log(logObject, log.levels.INFO);
    };

    log.warn = function (logObject) {
        log.log("WARN: ", log.levels.WARN);
        log.log(logObject, log.levels.WARN);
    };

    log.error = function (logObject) {
        log.log("ERROR: ", log.levels.ERROR);
        log.log(logObject, log.levels.ERROR);
    };

    log.fatal = function (logObject) {
        log.log("FATAL: ", log.levels.FATAL);
        log.log(logObject, log.levels.FATAL);
    };

    return log;
});