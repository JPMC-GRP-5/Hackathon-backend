import express from "express";
import * as HotelController from "../controllers/Hotel.js";

const router = express.Router();

router.get("/", HotelController.getEverything);
router.get("/city", HotelController.getCities);
// router.post("/create", HotelController.createHotel);

router.get("/read", HotelController.readHotels);

router.get("/:city", HotelController.getHotelsByCity);

export default router;
