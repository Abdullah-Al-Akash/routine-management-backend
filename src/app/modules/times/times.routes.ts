import { Router } from 'express';
import TimesController from './times.controller';

const router = Router();

router.get('/get-times-slots', TimesController.getTimesSlots);

const TimesRoutes = router;
export default TimesRoutes;
