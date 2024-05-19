import { Router } from 'express';
import { 
  getPosts,
  getPost, 
  createPost, 
  updatePost, 
  deletePost,
  deletePosts
} from '../controllers/posts.js';

const router = Router();

router.get('/', getPosts);
router.get('/:id', getPost);
router.post('/', createPost);
router.patch('/:id', updatePost);
router.delete('/:id', deletePost);
router.delete('/', deletePosts);

export default router;