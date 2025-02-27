import express from "express";
import Review from "../models/review.js";

const router = express.Router();

router.post("/", protect, async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const existingReview = await Review.findOne({ user: req.user._id });
    if (existingReview) {
      return res.status(400).json({ message: "You have already submitted a review!" });
    }

    const review = new Review({
      user: req.user._id,
      name: req.user.name,
      rating,
      comment,
    });

    await review.save();
    res.status(201).json({ message: "Review submitted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Failed to submit review", error });
  }
});

router.get("/", async (req, res) => {
    try {
      const reviews = await Review.find().sort({ createdAt: -1 });
      res.status(200).json(reviews);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch reviews", error });
    }
  });
  