import express from 'express';
import {
    generateArticle,
    getUserCreations,
    getPublicCreations,
    likeCreation,
    generateBlogTitles,
    reviewCV,
    generateImage,
    removeBackground,
    removeObject
} from '../controllers/aiController.js';
import { auth } from '../middleware/auth.js';
import multer from 'multer';

const upload = multer({ dest: 'uploads/' });

const aiRouter = express.Router();

// Fetch creations routes
aiRouter.get('/creations', auth, getUserCreations);
aiRouter.get('/creations/public', getPublicCreations); // Public community creations
aiRouter.post('/creations/:id/like', auth, likeCreation);

// Generation routes
aiRouter.post('/generate-article', auth, generateArticle);
aiRouter.post('/generate-blog-titles', auth, generateBlogTitles);
aiRouter.post('/generate-image', auth, generateImage);

// Upload routes
aiRouter.post('/review-cv', auth, upload.single('resume'), reviewCV);
aiRouter.post('/remove-background', auth, upload.single('image'), removeBackground);
aiRouter.post('/remove-object', auth, upload.single('image'), removeObject);

export default aiRouter;