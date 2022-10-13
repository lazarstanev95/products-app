const path = require('path');
const log4js = require('log4js');
const moment = require('moment');

const appenders = { console: { type: 'console' } };
const categories = { default: { appenders: ['console'], level: 'all' } };

const dateNow = moment().format('YYYY-MM-DDTHH-mm-ss');

function logger({ name, filename }) {
    const date = dateNow + '-' + filename;
    if (!appenders[name]) {
        appenders[name] = { type: "file", filename: path.join('logs', date) }
    }
    if (!categories[name]) {
        categories[name] = { appenders: [name, 'console'], level: 'all' };
    }
    log4js.configure({
        appenders: appenders,
        categories: categories
    });
    const logger = log4js.getLogger(name);
    return logger;
}

module.exports = {
    logger
}