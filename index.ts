import express, { urlencoded } from 'express';
const app = express();
import dotenv from 'dotenv';
dotenv.config();
const config = require('./src/config/config')['development'];
const PORT = config.port;
import mongoose from 'mongoose';
const URL = config.dburl;
import mainRouter from './src/router/main';
import cookieParser from 'cookie-parser';

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(express.json());

app.use('/api', mainRouter);

mongoose.connect(URL).then(() => {
  console.log('db connected');
});
app.listen(PORT, () => {
  console.log(`server running on port no ${PORT}`);
});
