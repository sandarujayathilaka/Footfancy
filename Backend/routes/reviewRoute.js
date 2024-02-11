import express from 'express';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';
import { createReviewCtrl } from '../controllers/reviewCtrl.js';

const reviewRouter = express.Router();

reviewRouter.post("/:productID", isLoggedIn, createReviewCtrl);

export default reviewRouter;