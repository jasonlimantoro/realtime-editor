const express = require('express');
const cors = require('cors');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const { jwt, errorHandler } = require('./lib/middleware');
require('express-async-errors');
require('./database');

const port = 4000;

const app = express();
const server = http.createServer(app);
app.use(morgan('common'));
app.use(bodyParser.json());
app.use(
  cors({
    origin: 'http://localhost:3000',
  })
);

app.get('/', (req, res) => res.send('Hello World!'));

app.use('/drafts', jwt(), require('./routes/draft').default);
app.use('/auth', require('./routes/auth').default);

app.use(errorHandler);

server.listen(port, () =>
  // eslint-disable-next-line no-console
  console.log(`Example app listening on port ${port}!`)
);

module.exports = { server };
