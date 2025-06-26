import express from "express"
import { generateShortUrl, redirectShortUrl, getAnalytics } from "../controllers/url.controller.js"
import {verifyJWT} from '../middlewares/auth.middleware.js'
const router = express.Router()
router.post('/shorten', verifyJWT, generateShortUrl)
router.get('/:shortId', redirectShortUrl)
router.get('/analytics/:shortId', getAnalytics)
export default router