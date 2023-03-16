import Place from "../models/place.schema.js"

export const getPlacesByCity=async (req,res,next)=>{
    try{
        if(!req.params.city) {
            res.status(400).send("Enter the city name")
        }
        const placesByCity=await Place.find({"city": req.params.city});
        res.status(200).json(placesByCity);
    }catch(e){
        console.error(e);
        res.status(500).send("internal sever error")
    }
}
export const getCities=async(req,res,next)=>{
    try{
        const Cities=await Place.distinct("city");
        res.status(200).json(Cities);
    }catch(e){
        console.error(e);
        res.status(500).send("internal sever error")
    }
}

export const getEverything=async(req,res,next)=>{
    try{
       const Cities=await Place.distinct("city");
       const Places=await Place.find();
       var every=[]
       Cities.forEach(element=>
        {const pl=[];
        Places.forEach(ele=>
            {if(ele.city==element){
                pl.push(ele)
            }}
        )
        every.push({
            city: element,
            places: pl
        })

       })
       res.status(200).json(every)
    }
       
    catch(e){
        console.error(e);
        res.status(500).send("internal sever error")
    }
}