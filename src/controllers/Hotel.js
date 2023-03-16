import Hotel from "../models/hotel.schema.js";

export const getHotelsByCity=async (req,res,next)=>{
    try{
        if(!req.params.city) {
            res.status(400).send("Enter the city name")
        }
		const city=req.params.city;
		console.log(city)
        const HotelsByCity=await Hotel.find({city: city});
        res.status(200).json(HotelsByCity);
    }catch(e){
        console.error(e);
        res.status(500).send("internal sever error")
    }
}

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