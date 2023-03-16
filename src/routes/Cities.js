import express from 'express'
const router=express.Router();
import * as CitiesController from "../controllers/City.js";

router.get("/",CitiesController.getEverything);
router.get("/city/:city",CitiesController.getPlacesByCity)

export default router;