import { Router } from "express";
import * as HotelController from "../controllers/Hotel.js";

const router = Router();

router.post("/create", HotelController.createHotel);

router.get("/", HotelController.readHotels);

export default router;
