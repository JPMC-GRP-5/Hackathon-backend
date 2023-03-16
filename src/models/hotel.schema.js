import mongoose from "mongoose";
const Schema = mongoose.Schema;

const HotelSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	address: {
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
	rooms: {
		type: Number,
		required: true,
	},
	rating: {
		type: Number,
		required: false,
	},
	cost: {
		type: Number,
		required: true,
	},
});

export default mongoose.model("Hotel", HotelSchema);
