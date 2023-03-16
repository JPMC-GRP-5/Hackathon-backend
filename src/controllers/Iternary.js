import placeSchema from "../models/places.schema.js";
import Place from "../models/places.schema.js";
function sliceIntoChunks(arr, chunkSize, budget) {
	const res = [];
	var day = 1;
	for (let i = 0; i < arr.length; i += chunkSize) {
		var price = 0,
			finalPrice = 0;
		var finalChunk = [];
		const chunk = arr.slice(i, i + chunkSize);
		chunk.forEach((element) => {
			price += element.entryFee;
			if (price <= budget) {
				finalChunk.push(element);
				finalPrice = price;
			} else {
				price -= element.entryFee;
			}
		});
		const object = {
			day: day,
			places: finalChunk,
			price: finalPrice,
		};
		res.push(object);
		day = day + 1;
	}
	return res;
}

export const generateIternary = async (req, res, next) => {
	try {
		if (!req.body.city) {
			res.status(400).send("Enter the city name");
		}
		const placesByCity = await Place.find({ city: req.body.city });
		const days = req.body.days;
		if (!days) {
			res.status(400).send("Enter number of days");
		}

		if (days > placesByCity.length) {
			res
				.send(403)
				.send("Not much to explore in these many days, kindly reduce days");
		}
		var budget = req.body.budget;
		const dayWisePlaces = sliceIntoChunks(
			placesByCity,
			placesByCity.length / days,
			budget / days
		);
		console.log(dayWisePlaces);
		console.log(dayWisePlaces.length);
		res.status(200).json(dayWisePlaces);
	} catch (e) {
		console.error(e);
		res.status(500).send("Internal Server Error");
	}
};
