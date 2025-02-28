import Review from "../models/review.js";

export async function addReview(req, res) {
    console.log(req.user);
  
    if (!req.user) {
      res.json({
        message: "You are not logged in",
      });
      return;
    }
  
    const { rating, comment } = req.body;
  
    if (!rating || !comment) {
      res.json({
        message: "Missing required fields: rating and comment are required",
      });
      return;
    }
  
    try {  
      const existingReview = await Review.findOne({ userEmail: req.user.email });
  
      if (existingReview) {
        res.json({
          message: "You have already submitted a review!",
        });
        return;
      }
  
      const review = new Review({
        userEmail: req.user.email, 
        name: `${req.user.firstName} ${req.user.lastName}`, 
        rating,
        comment,
      });
  
      await review.save();
      res.json({
        message: "Review submitted successfully",
      });
    } catch (error) {
      res.json({
        message: "Due to an error, the review couldn't be submitted: " + error,
      });
    }
  }
  

export async function listReviews(req, res) {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json({
      list: reviews,
    });
  } catch (error) {
    res.json({
      message: "Due to an error, reviews couldn't be retrieved: " + error,
    });
  }
}

export async function updateReview(req, res) {
    console.log(req.user);

    if (!req.user) {
        res.json({
            message: "You are not logged in",
        });
        return;
    }

    const { rating, comment } = req.body;

    if (!rating && !comment) {
        res.json({
            message: "At least one field (rating or comment) must be provided to update.",
        });
        return;
    }

    try {
        console.log("Received Update Data:", req.body);

        const existingReview = await Review.findOne({ userEmail: req.user.email });

        if (!existingReview) {
            res.json({
                message: "No review found for this user.",
            });
            return;
        }

        const updateFields = {};
        if (rating !== undefined) updateFields.rating = rating;
        if (comment !== undefined) updateFields.comment = comment;

        const updatedReview = await Review.findOneAndUpdate(
            { userEmail: req.user.email },
            { $set: updateFields },
            { new: true, runValidators: true }
        );

        res.json({
            message: "Review updated successfully",
            updatedReview,
        });
    } catch (error) {
        res.json({
            message: "Due to an error, the review couldn't be updated: " + error,
        });
    }
}

export async function delReview(req, res) {
  console.log(req.user);

  if (!req.user) {
    res.json({
      message: "You are not logged in",
    });
    return;
  }

  if (req.user.type !== "admin") {
    res.json({
      message: "You are not an admin and are not authorized to perform this action.",
    });
    return;
  }

  try {
    const result = await Review.findByIdAndDelete(req.params.id);

    if (!result) {
      res.json({
        message: "The review with ID " + req.params.id + " was not found",
      });
      return;
    }

    res.json({
      message: "The review was deleted successfully",
      result,
    });
  } catch (error) {
    res.json({
      message: "The review was not deleted due to an error: " + error,
    });
  }
}

