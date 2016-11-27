import 'babel-polyfill';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import session from 'express-session';
import SequelizeSession from 'connect-session-sequelize';

import models from './models';
import routers from './routers/';

const app = express();

const SessionStore = SequelizeSession(session.Store);
const sessionSecret = process.env.SESSION_SECRET;
const origins = process.env.ORIGINS;

if (!sessionSecret) {
  throw new Error('SESSION_SECRET is required.');
}

if (!origins) {
  throw new Error('ORIGINS is required.');
}

app
.use(cors({
  credentials: true,
  origin: origins.split(','),
  unset: 'destroy'
}))
.use(session({
  secret: sessionSecret,
  saveUninitialized: false,
  resave: false,
  store: new SessionStore({db: models.sequelize})
}))
.use(bodyParser.json())
.use(bodyParser.urlencoded({extended: false}))
.use(routers)
.use((err, req, res, next) => res.status(err.code).json(err));

models.sequelize.sync().then(() => {
  const server = app.listen(process.env.PORT || 3000, () => {
    console.log('Listening at http://%s:%s', server.address().address, server.address().port);
  });
});
