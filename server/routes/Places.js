import { Router } from "express";
import * as PlacesController from "../controllers/Places.js";

const router = Router();

router.get("/", PlacesController.getPlaces);
router.get("/read", PlacesController.readPlaces);
router.get('/info/:location',PlacesController.getInfo)
export default router;
