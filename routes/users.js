import { Router } from 'express';
import { 
  login, 
  signup,
  updatePassword,
  getInfo,
  updateInfo,
} from '../controllers/users.js';
import { checkRequestBodyValidator, isAuth } from '../middlewares/index.js';

const router = Router();

router.use(checkRequestBodyValidator);

router.post('/login', login);
router.post('/signup', signup);
router.post('/updatePassword', isAuth, updatePassword);
router.get('/profile', isAuth, getInfo);
router.patch('/profile', isAuth, updateInfo);


export default router;
