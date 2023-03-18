import mongoose from "mongoose";
const Schema = mongoose.Schema;

const HotelSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	city: {
		type: String,
		required: true,
	},
	siteUrl: {
		type: String,
		required: true,
	},
	latitude: {
		type: Number,
		required: true,
	},
	longitude: {
		type: Number,
		required: true,
	},
	rating: {
		type: Number,
		required: false,
	},
});

export default mongoose.model("Hotel", HotelSchema);
