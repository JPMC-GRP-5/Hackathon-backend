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
		.on("data", (row, index) => {
			data.push({
				name: row.property_name,
				latitude: parseFloat(row.latitude),
				longitude: parseFloat(row.longitude),
				siteUrl: row.pageurl,
				rating: parseFloat(row.site_review_rating),
				city: row.city.toLowerCase(),
			});
			// if (typeof parseFloat(row.site_review_rating) !== "number")
			// 	console.log(index);
		})
		.on("end", async () => {
			console.log("CSV file successfully processed");
			await Hotel.insertMany(data);
			return res.status(200).json(data);
		});
};

export const getHotelsByCity = async (req, res) => {
	const { city } = req.params;
	console.log(city);
	const hotels = await Hotel.find({ city: city });
	return res.status(200).json(hotels);
};
