/* eslint-disable @typescript-eslint/no-explicit-any */
import { Router } from 'express';
import TimesRoutes from '../modules/times/times.routes';
import RoutineRoutes from '../modules/routine/routine.routes';
import TeacherRoutes from '../modules/teacher/teacher.routes';

type TRoute = {
  path: string;
  route: any;
};
const router = Router();

const moduleRoutes: TRoute[] = [
  { path: '/times', route: TimesRoutes },
  { path: '/routine', route: RoutineRoutes },
  { path: '/teacher', route: TeacherRoutes },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
