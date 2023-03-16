import { Router } from "express";
import * as PlacesController from "../controllers/Places.js";

const router = Router();

router.get("/", PlacesController.getPlaces);
router.get("/read", PlacesController.readPlaces);

export default router;
