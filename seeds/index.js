const mongoose = require("mongoose");
const Campground = require("../models/campground");
const cities = require("./cities");
const {places,descriptors}=require('./seedHelper')

mongoose.connect("mongodb://localhost:27017/yelp-camp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("database connected");
});


const sample=(array)=>{
   return array[Math.floor(Math.random()*array.length)];
}


const seedDB= async()=>{
  await Campground.deleteMany({});
  for(let i=0;i<400;i++)
  {
      const random=Math.floor(Math.random()*1000);
      const price=Math.floor(Math.random()*20)+10;
      const camp = new Campground({
        author: "6188e96dcdee652df3dbc487",
        location: `${cities[random].city}, ${cities[random].state}`,
        title: `${sample(descriptors)} ${sample(places)}`,

        description:
          "Nature is a British weekly scientific journal founded and based in London, England. As a multidisciplinary publication, Nature features peer-reviewed research from a variety of academic disciplines, mainly in science and technology",
        price,
        image: [
          {
            url: "https://res.cloudinary.com/dk402fvuf/image/upload/v1637175590/YelpCamp/bqko9khomxnrdk2a5m0w.jpg",
            filename: "YelpCamp/bqko9khomxnrdk2a5m0w",
          },
          {
            url: "https://res.cloudinary.com/dk402fvuf/image/upload/v1637175590/YelpCamp/ygg1vg0krg0qhrysopc8.jpg",
            filename: "YelpCamp/ygg1vg0krg0qhrysopc8",
          },
          {
            url: "https://res.cloudinary.com/dk402fvuf/image/upload/v1637175590/YelpCamp/klnaf4bb5qgcogaccji9.jpg",
            filename: "YelpCamp/klnaf4bb5qgcogaccji9",
          },
        ],
        geometry: {
          type:'Point',
          coordinates: [
            cities[random].longitude,
            cities[random].latitude,
          ],
        },
      });
     await camp.save();
  }
}

seedDB().then(()=>{
    mongoose.connection.close();
})