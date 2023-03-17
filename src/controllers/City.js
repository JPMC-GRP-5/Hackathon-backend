import Place from "../models/places.schema.js";
import Redis from '../redis.js';

export const getPlacesByCity = async (req, res, next) => {
	try {
		if (!req.params.city) {
			res.status(400).send("Enter the city name");
		}
		const placesByCity = await Place.find({ city: req.params.city });
		Redis.SET("places:"+city,placesByCity);
		res.status(200).json(placesByCity);
	} catch (e) {
		console.error(e);
		res.status(500).send("internal sever error");
	}
};

export const getCachedPlacesByCity=async(req,res,next)=>{
	try{
		const city=req.params.city;
		const key="places:"+city;
		const data=Redis.GET(city);
		if(data){
			res.status(200).send(data);
		}else{
			next();
		}
	}catch(e){
		res.status(500).send("Internal Server Error")
	}
}
export const getCities = async (req, res, next) => {
	try {
		const Cities = await Place.distinct("city");
		res.status(200).json(Cities);
	} catch (e) {
		console.error(e);
		res.status(500).send("internal sever error");
	}
};

export const getEverything = async (req, res, next) => {
	try {
		const Cities = await Place.distinct("city");
		const Places = await Place.find();
		var every = [];
		Cities.forEach((element) => {
			const pl = [];
			Places.forEach((ele) => {
				if (ele.city == element) {
					pl.push(ele);
				}
			});
			every.push({
				city: element,
				places: pl,
			});
		});
		Redis.SET("places:everything",every)
		res.status(200).json(every);
	} catch (e) {
		console.error(e);
		res.status(500).send("internal sever error");
	}
};

export const getEverythingCached=(req,res,next)=>{
	try{
		const data=Redis.GET("places:everything");
		if(!data) next()
		else{
			res.status(200).send(data);
		}
	}catch(e){
		res.status(500).send("internal sever error")
	}
}