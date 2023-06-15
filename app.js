require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const cors = require('cors');
const errorsHandler = require('./middlewares/errorsHandler');
const limiter = require('./utils/limiter');

const { requestsLogger, errorsLogger } = require('./middlewares/logger');

const app = express();
app.use(
  cors({
    origin: ['https://filimonov.mesto.nomoredomains.rocks'],
    credentials: true,
    maxAge: 30,
  }),
);
const { PORT = 3000, DB_CONN } = process.env;
mongoose.connect(DB_CONN);

app.use(requestsLogger);
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(helmet());
app.use(limiter);

app.use(require('./routes'));

app.use(errorsLogger);
app.use(errors());
app.use(errorsHandler);

app.listen(PORT);
