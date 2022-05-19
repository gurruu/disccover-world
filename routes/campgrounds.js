const express = require("express");
const router = express.Router();

const campground = require("../controller/Campground");
const Campground = require("../models/campground");
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const { campgroundSchema } = require("../schemas");
const Review = require("../models/review");
const {isLoggedIn}=require('../middleware');
const { RenderIndex } = require("../controller/Campground");
const multer = require("multer");
const {storage}=require('../cloudinary')
const upload = multer({ storage });


const validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);

  // console.log(error);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

// <-----------GET----------->

router.get(
  "/",
  catchAsync(campground.RenderIndex)
);

// <-----------post-------------------->

router.get("/new", isLoggedIn,campground.new);

router.post(
  "/",
  isLoggedIn,
  upload.array("image"),
  validateCampground,
  catchAsync(campground.addNew)
);



router.get(
  "/:id",
  catchAsync(campground.showCamp)
);

// <-------------UPDATE---------------------->
router.get(
  "/:id/edit",
  isLoggedIn,
  catchAsync(campground.updatePage)
);

router.put(
  "/:id",
  isLoggedIn,
  upload.array("image"),
  validateCampground,
  catchAsync(campground.updateCamp)
);

// <-------------DELETE------------------------>

router.delete(
  "/:id",
  isLoggedIn,
  catchAsync(campground.deleteCamp)
);

module.exports=router;