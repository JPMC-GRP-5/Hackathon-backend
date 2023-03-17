import fs from "fs";
import { parse } from "csv-parse";
import Places from "../models/places.schema.js";
import Geo from "geo-nearby";
import createCompletionChatGTP from "./openAI.js";
export const readPlaces = async (req, res) => {
	const data = [];
	await fs
		.createReadStream("src/utils/places.data.csv")
		.pipe(parse({ delimiter: ",", columns: true, ltrim: true }))
		.on("data", (row) => {
			data.push({
				name: row.touristPlace.toLowerCase(),
				city: row.city.toLowerCase(),
				latitude: parseFloat(row.latitude),
				longitude: parseFloat(row.longitude),
				rating: parseFloat(row.rating),
				imageUrl: row.imageURL,
				entryFee: parseInt(row.entryFee),
			});
		})
		.on("end", async () => {
			console.log("CSV file successfully processed");
			console.log(data);
			console.log(data.length);
			await Places.insertMany(data);
			return res.status(200).json(data);
		});
};

export const getPlaces = async (req, res) => {
	const { city } = req.query;
	const places = await Places.find({ city: city });
	places.sort((a, b) => b.rating - a.rating);
	if (places.length === 0) {
		return res.status(404).json({ message: "No places found" });
	}
	const data = places.map((place, index) => {
		return [place.latitude, place.longitude, index];
	});
	const placesSet = new Set();
	const nearbyPlaces = [];
	for (let i = 0; i < data.length; i++) {
		const nearbyArray = [places[i]];
		let cost = 0;
		if (placesSet.has(data[i][2])) {
			continue;
		}
		placesSet.add(data[i][2]);
		const lat = data[i][0];
		const lon = data[i][1];
		const dataSet = Geo.createCompactSet(data);
		const geo = new Geo(dataSet, { sorted: true });
		const nearby = geo.nearBy(lat, lon, 3000);
		console.log(nearby);
		for (let j = 0; j < (nearby.length <= 3 ? nearby.length : 3); j++) {
			if (!placesSet.has(nearby[j].i)) {
				placesSet.add(nearby[j].i);
				nearbyArray.push(places[nearby[j].i]);
				cost += places[nearby[j].i].entryFee;
			}
		}
		nearbyPlaces.push({
			places: nearbyArray,
			cost: cost,
		});
	}

	return res.status(200).json(nearbyPlaces);
};

export const getInfo = async (req, res) => {
	try {
		const location = req.params.location;
		const response = await createCompletionChatGTP(location);
		res.status(200).send(response);
	} catch (e) {
		console.log(e);
		res.status(500).send("Internal server error");
	}
};
