const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGODB_URI);

const profileSchema = new mongoose.Schema({
  name: String,
  age: Number,
  profession: String,
  location: String,
});

const Profile = mongoose.model("Profile", profileSchema, "user_profiles");

app.post("/api/add-profile", async (req, res) => {
  try {
    const newProfile = new Profile(req.body);
    await newProfile.save();
    res.status(201).json({ message: "Profile added successfully" });
    console.log("Profile Added");
  } catch (e) {
    console.error(e);
    res.status(400).json({ message: "Error adding profile", error: e });
  }
});

app.get("/api/profiles", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 6;
  const skip = (page - 1) * limit;

  try {
    const totalProfiles = await Profile.countDocuments();
    const profiles = await Profile.find().skip(skip).limit(limit);

    const totalPages = Math.ceil(totalProfiles / limit);

    res.json({
      profiles,
      totalPages,
    });
    console.log("Successfully retrieved, PageNo: ", page);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching profiles", error: err });
  }
});

app.get("/", async (req, res) => {
  res.status(200).json({ message: "Page loaded successfully" });
  console.log("Running");
  return "Running";
});

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
