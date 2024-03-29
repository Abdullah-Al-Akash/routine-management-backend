/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import cors from 'cors';
import bodyParser from 'body-parser';
import express, { Application } from 'express';
import globalErrorHandler from './app/middlewares/globalErrorhandler';
import notFound from './app/middlewares/notFound';
import router from './app/routes';
import Routine from './app/modules/routine/routine.model';

const app: Application = express();

//parsers
app.use(express.json({ limit: '50mb' }));

app.use(
  cors({
    origin: ['http://localhost:5173'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  }),
);
app.use(bodyParser.urlencoded({ extended: false }));

// Middleware to parse application/json
app.use(bodyParser.json());
// application routes
app.use('/api/v1', router);
app.get('/api/v1/all-routines', async (req, res) => {
  const routines = await Routine.find();
  res.send(routines);
});

app.use(globalErrorHandler);

//Not Found
app.use(notFound);

export default app;
