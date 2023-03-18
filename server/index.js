import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import UserRouter from "./routes/User.js";
import HotelRouter from "./routes/Hotel.js";
import Iternary from './routes/Iternary.js'
import CitiesRouter from './routes/Cities.js'
import PlaceRouter from "./routes/Places.js";

const PORT = process.env.PORT || 8081;

const app = express();

dotenv.config();

mongoose.connect(process.env.MONGO_URI, () => {
	console.log("Connected to DB");
	app.listen(PORT, () => {
		console.log(`Server running on port: ${PORT}`);
	});
});

app.use(cors());
app.use(bodyParser.json());

app.use("/users", UserRouter);
app.use("/hotels", HotelRouter);
app.use("/places", PlaceRouter);
app.use("/city",CitiesRouter);
