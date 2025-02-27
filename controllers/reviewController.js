import Review from "../models/review.js";

export async function addReview(req, res) {
  console.log(req.user);

  if (req.user == null) {
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
    const existingReview = await Review.findOne({ user: req.user._id });

    if (existingReview) {
      res.json({
        message: "You have already submitted a review!",
      });
      return;
    }

    const review = new Review({
      user: req.user._id,
      name: req.user.name,
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
