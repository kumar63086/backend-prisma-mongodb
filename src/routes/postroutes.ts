import { Router } from 'express';
import { createPost, updatePost, deletePost, getPosts } from '../controllers/postcontrollers';
import isLoggedIn from '../middleware/islogedin';
const router = Router();

router.post('/create', isLoggedIn, createPost);
router.put('/update/:id', isLoggedIn, updatePost);
router.delete('/delete/:id', isLoggedIn, deletePost);
router.get('/getall', getPosts);

export default router;