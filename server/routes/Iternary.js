import { Router } from "express";
import * as Iternary from "../controllers/Iternary.js";

const router = Router();

router.post("/", Iternary.generateIternary);

export default router;
