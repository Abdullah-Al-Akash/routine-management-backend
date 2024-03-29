import { Router } from 'express';
import RoutineControllers from './routine.controller';

const router = Router();

router.get('/', RoutineControllers.getRoutine);
router.patch('/swap', RoutineControllers.routineSwap);
router.patch('/assign-room', RoutineControllers.assignRoom);
router.post('/insert-routines', RoutineControllers.insertRoutines);
router.patch('/add-new-batch', RoutineControllers.addNewBatch);

const RoutineRoutes = router;
export default RoutineRoutes;
