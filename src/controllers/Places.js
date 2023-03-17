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
	const { city, budget } = req.query;
	let totalCost = budget;
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
		if (placesSet.has(data[i][2]) || places[i].entryFee > totalCost) {
			continue;
		}
		let cost = places[i].entryFee;
		totalCost -= places[i].entryFee;
		placesSet.add(data[i][2]);
		const lat = data[i][0];
		const lon = data[i][1];
		const dataSet = Geo.createCompactSet(data);
		const geo = new Geo(dataSet, { sorted: true });
		const nearby = geo.nearBy(lat, lon, 3000);
		console.log(nearby);
		for (let j = 0; j < (nearby.length <= 2 ? nearby.length : 2); j++) {
			if (
				!placesSet.has(nearby[j].i) &&
				places[nearby[j].i].entryFee <= totalCost
			) {
				placesSet.add(nearby[j].i);
				nearbyArray.push(places[nearby[j].i]);
				cost += places[nearby[j].i].entryFee;
				totalCost -= places[nearby[j].i].entryFee;
			}
		}
		nearbyPlaces.push({
			places: nearbyArray,
			cost: cost,
		});
	}

	return res.status(200).json({
		nearbyPlaces: nearbyPlaces,
		totalCost: budget - totalCost,
	});
};

export const setDescription = async (req, res) => {
	const places = await Places.find();
	for (let i = 0; i < places.length; i++) {
		const place = places[i];
		console.log(place.name);
		const description = await createCompletionChatGTP(
			place.name + ", " + place.city
		);
		place.description = description;
		await place.save();
	}
	return res.status(200).json(places);
};

export const getNearbyPlaces = async (req, res) => {
	const { latitude, longitude } = req.query;
	const places = await Places.find();
	const data = places.map((place, index) => {
		return [place.latitude, place.longitude, index];
	});
	const dataset = Geo.createCompactSet(data);
	const geo = new Geo(dataset, { sorted: true });
	const nearby = geo.nearBy(latitude, longitude, 3000);
	const nearbyPlaces = [];
	for (let i = 0; i < nearby.length; i++) {
		nearbyPlaces.push(places[nearby[i].i]);
	}
	return res.status(200).json(nearbyPlaces);
};

export const getInfo = async (req, res) => {
	// try {
	// 	const location = req.params.location;
	// 	const response = await createCompletionChatGTP(location);
	// 	res.status(200).send(response);
	// } catch (e) {
	// 	console.log(e);
	// 	res.status(500).send("Internal server error");
	// }
	const { location } = req.params;
	console.log(location);
	const response = await createCompletionChatGTP(location);
	return res.status(200).send(response);
};
