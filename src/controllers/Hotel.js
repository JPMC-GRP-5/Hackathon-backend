import Hotel from "../models/hotel.schema.js";



export const getCities=async(req,res,next)=>{
    try{
        const Cities=await Hotel.distinct("city");
        res.status(200).json(Cities);
    }catch(e){
        console.error(e);
        res.status(500).send("internal sever error")
    }
}

export const getEverything=async(req,res,next)=>{
    try{
       const Cities=await Hotel.distinct("city");
       const Hotels=await Hotel.find();
       var every=[]
       Cities.forEach(element=>
        {const pl=[];
        Hotels.forEach(ele=>
            {
				if(ele.city==element){
				console.log(ele.city)
                pl.push(ele)
            }}
        )
        every.push({
            city: element,
            hotels: pl
        })
       })
       res.status(200).json(every)
    }
       
    catch(e){
        console.error(e);
        res.status(500).send("internal sever error")
    }
}
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
