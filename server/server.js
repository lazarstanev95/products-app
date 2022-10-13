const http = require('http');
const app = require('./app');
const { logger } = require('./utils/logger');
const log = logger({ name: 'Server', filename: 'server.log' })

const port = process.env.PORT || 4000;

const server = http.createServer(app);

server.listen(port, () => {
  log.info('Server is running on Port:', port);
});