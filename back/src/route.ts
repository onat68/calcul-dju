import express from 'express';
import * as getController from './getController.js'
const router = express.Router();

router.get("/station/:station", getController.getByStation)
router.get("/dju/:station/:winter/:seuilRef", getController.getDJUByWinter)

export default router