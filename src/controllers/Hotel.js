import Hotel from "../models/hotel.schema.js";
import fs from "fs";
import { parse } from "csv-parse";

export const createHotel = async (req, res) => {
	console.log(req.body);
	const hotel = new Hotel(req.body);
	await hotel
		.save()
		.then(() => {
			res.status(201).json(hotel);
		})
		.catch((error) => {
			res.status(400).json({ error: error });
		});
	// const hotel = new Hotel(req.body);
	// await hotel.save();
};

export const readHotels = async (req, res) => {
	const data = [];
	await fs
		.createReadStream("src/utils/hotels.data.csv")
		.pipe(parse({ delimiter: ",", columns: true, ltrim: true }))
		.on("data", (row) => {
			data.push({
				name: row.Name,
				address: row.Address,
				latitude: parseFloat(row.Latitude),
				longitude: parseFloat(row.Longitude),
				rooms: parseInt(row.Rooms),
				cost: parseInt(row.Price),
				rating: parseInt(row.Rating),
			});
		})
		.on("end", async () => {
			console.log("CSV file successfully processed");
			console.log(data);
			await Hotel.insertMany(data);
			return res.status(200).json(data);
		});
};
