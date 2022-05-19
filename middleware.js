const Review = require("./models/review")

module.exports.isLoggedIn=(req,res,next)=>{
    req.session.returnTo=req.originalUrl
   if(!req.isAuthenticated())
   {
       req.flash('error','you must be signed in first')
       return res.redirect('/login')
   }
   next()
}

// module.exports.isReviewAuthor=async(req,res,next)=>{
//     const {id,reviewId}=req.params;
//     const review=await Review.findById(reviewId)
//     console.log(review)
//     if(!review.author.equals(req.user._id))
//     {
//         req.flash('error','You have no permission to do that !!')
//         return res.redirect(`/campgrounds/${id}`)
//     }
//     next()
// }