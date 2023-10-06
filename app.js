const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
require('dotenv').config();
const routes = require('./routes');
const centralizedErrorHandler = require('./middlewares/centralizedErrorHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const rateLimit = require('./middlewares/rateLimit');

// const { PORT = 3001, MONGODB_URI = 'mongodb://127.0.0.1:27017/moviesdb' } = process.env;
const { PORT = 3001, MONGODB_URI = 'mongodb://95.163.240.177:27017/' } = process.env;

const app = express();

app.use(express.json());
app.use(cookieParser());

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
});
app.use(requestLogger);

app.use(helmet());
app.use(rateLimit);
app.use(routes);

app.use(errorLogger);

app.use(errors());
app.use(centralizedErrorHandler);

app.listen(PORT);
