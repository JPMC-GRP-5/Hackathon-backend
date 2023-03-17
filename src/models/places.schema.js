import mongoose from "mongoose";
const Schema = mongoose.Schema;

const PlaceSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	city: {
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
	entryFee: {
		type: Number,
		required: true,
	},
	imageUrl: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
});

export default mongoose.model("Place", PlaceSchema);
