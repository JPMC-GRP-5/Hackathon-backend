import Hotel from "../models/hotel.schema.js";
import fs from "fs";
import { parse } from "csv-parse";
import Places from "../models/places.schema.js";
import Geo from "geo-nearby";

const cities = [
	"mumbai",
	"jaipur",
	"chennai",
	"delhi",
	"kochi",
	"kolkata",
	"manali",
	"mysore",
	"panaji",
];

export const getCities = async (req, res, next) => {
	try {
		const Cities = await Hotel.distinct("city");
		res.status(200).json(Cities);
	} catch (e) {
		console.error(e);
		res.status(500).send("internal sever error");
	}
};

export const getNearbyHotels = async (req, res) => {
	const { latitude, longitude } = req.query;
	const hotels = await Hotel.find();
	const data = hotels.map((hotel, index) => {
		return [hotel.latitude, hotel.longitude, index];
	});
	const dataset = Geo.createCompactSet(data);
	const geo = new Geo(dataset, { sorted: true });
	const nearby = geo.nearBy(latitude, longitude, 3000);
	const nearbyPlaces = [];
	for (let i = 0; i < nearby.length; i++) {
		nearbyPlaces.push(hotels[nearby[i].i]);
	}
	return res.status(200).json(nearbyPlaces);
};

export const getEverything = async (req, res, next) => {
	try {
		const Cities = await Hotel.distinct("city");
		const Hotels = await Hotel.find();
		var every = [];
		Cities.forEach((element) => {
			const pl = [];
			Hotels.forEach((ele) => {
				if (ele.city == element) {
					console.log(ele.city);
					pl.push(ele);
				}
			});
			every.push({
				city: element,
				hotels: pl,
			});
		});
		res.status(200).json(every);
	} catch (e) {
		console.error(e);
		res.status(500).send("internal sever error");
	}
};
export const readHotels = async (req, res) => {
	const data = [];
	await fs
		.createReadStream("src/utils/hotels.data.csv")
		.pipe(parse({ delimiter: ",", columns: true, ltrim: true }))
		.on("data", (row, index) => {
			if (cities.includes(row.city.toLowerCase())) {
				data.push({
					name: row.property_name,
					latitude: parseFloat(row.latitude),
					longitude: parseFloat(row.longitude),
					siteUrl: row.pageurl,
					rating: parseFloat(row.site_review_rating),
					city: row.city.toLowerCase(),
				});
			}
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
