var express = require("express"),
	router = express.Router(),
	Campground = require("../models/campground"),
	middleware = require("../middleware");

//Campgrounds Routes

//Index Route
router.get("/", function(req, res){
	req.user
	Campground.find({}, function(err, allcampgrounds){
		if(err){
			console.log(err);
		} else {
			res.render("campgrounds/index", {campgrounds: allcampgrounds});
		}
	})
	
});

//Create campground route
router.post("/", middleware.isLoggedIn, function(req, res){
	var name = req.body.name;
	var price = req.body.price;
	var image = req.body.image;
	var desc = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	};
	var newCampground = {name: name, price: price, image: image, description: desc, author: author};
	Campground.create(newCampground, function(err, newlyCreated){
		if(err){
			console.log(err);
		} else {
			console.log(newlyCreated);
			res.redirect("/campgrounds");
		}
	});
});

//New - show form to create campground
router.get("/new", middleware.isLoggedIn, function(req, res){
	res.render("campgrounds/new");
});

//SHOW ROUTE - show more info of one campground
router.get("/:id", function(req, res){
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err || !foundCampground){
			req.flash("error", "Campground not found");
			res.redirect("back");
		} else {
			console.log(foundCampground);
			res.render("campgrounds/show", {campground: foundCampground});
		}
	});
});

//Edit Campground Route

router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findById(req.params.id, function(err, foundCampground){
		res.render("campgrounds/edit", {campground: foundCampground});
	});
});

//Update Campground Route
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
	//find and update the correct campgrounds
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
		if(err){
			res.redirect("/campgrounds");
		} else {
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

//destroy campground route
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
   Campground.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/campgrounds");
      } else {
          res.redirect("/campgrounds");
      }
   });
});

module.exports = router;