import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    trim: true
  },
  content: {
    type: String,
    required: [true, "Content is required"]
  },
  author: {
    type: String,
    default: "Anonymous"
  }
}, { timestamps: true });

export default mongoose.model("Post", postSchema);
