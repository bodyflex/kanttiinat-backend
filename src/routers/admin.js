import express from 'express';
import worker from '../parser/worker';
import models from '../models';
import createModelRouter from '../utils/createModelRouter';
import authenticate from '../utils/authenticate';

export default express.Router()
.use(authenticate)
.use((req, res, next) => {
  if (req.user.admin) {
    next();
  } else {
    next({code: 401, message: 'Unauthorized.'});
  }
})
.use(createModelRouter(models.Area))
.use(createModelRouter(models.Restaurant))
.use(createModelRouter(models.Favorite))
.post('/update-restaurants', (req, res) =>
  worker.updateAllRestaurants().then(() => res.json({message: 'ok'}))
);
