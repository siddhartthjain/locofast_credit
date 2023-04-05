import app from './app';
import auth from './auth';
import db from './database';
import redis from './redis';
import settings from './settings';
import services from './services';
import dataProvider from './dataProvider'

export default [app, auth, db, redis, settings, services, dataProvider];
