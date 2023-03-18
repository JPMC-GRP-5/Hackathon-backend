import { Router } from "express";
import * as UserController from "../controllers/User.js";

const router = Router();

router.get("/", (req, res) => {
	UserController.sayHello(req, res);
});

export default router;
