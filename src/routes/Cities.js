import express from 'express'
const router=express.Router();
import * as CitiesController from "../controllers/City.js";

router.get("/",CitiesController.getEverythingCached,CitiesController.getEverything);
router.get("/city/:city",CitiesController.getCachedPlacesByCity,CitiesController.getPlacesByCity)

export default router;