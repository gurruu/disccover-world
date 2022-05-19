const mongoose = require("mongoose");
const review = require("./review");

const Schema = mongoose.Schema;
const opts={toJSON:{virtuals:true}}

const CampgroundSchema = new Schema({
  title: String,
  image: [
    {
      url:String,
      filename:String
    }
  ],
  geometry:{
    type:{
      type:String,
      enum:['Point'],
      required:true
    },
    coordinates:{
      type:[Number],
      required:true
    }
  },
  price: Number,
  description: String,
  location: String,
  author:{
    type:Schema.Types.ObjectId,
    ref:'User'
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
},opts);

CampgroundSchema.virtual('properties.popUp').get(function(){
  return `<strong><a href="/campgrounds/${this._id}">${this.title}</a></strong>
  <p>${this.description.substring(0,40)}...</p>`
})

CampgroundSchema.post("findOneAndDelete", async function (doc) {
  // console.log('delele')
  if (doc) {
    await review.deleteMany({
      _id: {
        $in: doc.reviews,
      },
    });
  }
});

module.exports = mongoose.model("Campground", CampgroundSchema);
