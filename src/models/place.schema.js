import mongoose from "mongoose";
const Schema = mongoose.Schema;

const Place = new Schema({
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
    imageUrl:{
        type: String
    }
});

export default mongoose.model("Place", Place);
