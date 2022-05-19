const Campground = require("../models/campground");
const mbxCoding=require('@mapbox/mapbox-sdk/services/geocoding')
const mapBoxToken=process.env.MAPBOX_TOKEN;
const geocoder=mbxCoding({accessToken:mapBoxToken})

module.exports.RenderIndex = async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
};

module.exports.new = (req, res) => {
  res.render("campgrounds/new");
};

module.exports.addNew = async (req, res, next) => {
  
  const geoData = await geocoder
    .forwardGeocode({
      query: req.body.campground.location,
      limit: 1,
    })
    .send();
  
  const newCamp = new Campground(req.body.campground);
  newCamp.geometry = geoData.body.features[0].geometry;
  newCamp.image = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  newCamp.author = req.user._id;
  await newCamp.save();
  console.log(newCamp)
  req.flash("success", "Succesfully added new Campground");
  res.redirect(`/campgrounds/${newCamp._id}`);
};

module.exports.showCamp = async (req, res) => {
  const campground = await Campground.findById(req.params.id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("author");
  // console.log(campground.reviews);
  if (!campground) {
    req.flash("error", "Cannot Find Campground");
    return res.redirect("/campgrounds");
  }

  res.render("campgrounds/show", { campground });
};

module.exports.updatePage = async (req, res) => {
  const { id } = req.params;
  const camp = await Campground.findById(id);
  if (!camp.author.equals(req.user._id)) {
    req.flash("error", "You have no permission to Update");
    return res.redirect(`/campgrounds/${id}`);
  }
  const campground = await Campground.findById(req.params.id);
  res.render("campgrounds/edit", { campground });
};





module.exports.updateCamp = async (req, res) => {
  const { id } = req.params;
  const camp = await Campground.findById(id);
  if (!camp.author.equals(req.user._id)) {
    req.flash("error", "You have no permission to Update");
    return res.redirect(`/campgrounds/${id}`);
  }
  const campground = await Campground.findByIdAndUpdate(id, {
    ...req.body.campground,
  });
 const images= req.files.map((f) => ({
    url: f.pah,
    filename: ft.filename,
  }));
  campground.image.push(...images)
  await campground.save()
  // console.log(req.body)
  if(req.body.deleteImg)
  {
await campground.updateOne({
  $pull: { image: { filename: { $in: req.body.deleteImg } } },
});
  }
  
  req.flash("success", "Campground Updated Successfully!!");
  res.redirect(`/campgrounds/${campground._id}`);
};



module.exports.deleteCamp = async (req, res) => {
  const { id } = req.params;
  const camp = await Campground.findById(id);
  if (!camp.author.equals(req.user._id)) {
    req.flash("error", "You have no permission to Update");
    return res.redirect(`/campgrounds/${id}`);
  }
  await Campground.findByIdAndDelete(id);
  req.flash("success", "Successfully Deleted Campground!!");
  res.redirect("/campgrounds");
};