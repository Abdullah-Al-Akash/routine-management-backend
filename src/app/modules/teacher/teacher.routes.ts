import { Router } from 'express';
import TeacherControllers from './teacher.controller';

const router = Router();

router.patch('/assign', TeacherControllers.assignTeacher);
router.get('/', TeacherControllers.getTeachers);
router.get(
  '/get-individual-routine/:teacherId',
  TeacherControllers.getIndividualRoutine,
);
router.post('/insert-teachers', TeacherControllers.insertTeachers);
const TeacherRoutes = router;
export default TeacherRoutes;
