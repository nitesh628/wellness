import {Router} from "express";
import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";
import { createDoctor, getAllDoctors, getDoctorById, toggleDoctorStatus, updateDoctor } from "../controllers/doctorUserController.js";
import { createInfluencer, getAllInfluencers, getInfluencerById, toggleInfluencerStatus, updateInfluencer } from "../controllers/influencerController.js";
import { upload } from "../config/s3Config.js";

const router = Router();

// Routes
router.post("/",upload.single("imageUrl"), createUser);          // Create user
router.get("/", getUsers);             // Get all users
router.get("/:id", getUserById);       // Get user by ID
router.put("/:id",upload.single("imageUrl"), updateUser);        // Update user
router.delete("/:id", deleteUser);     // Delete user


router.post("/doctor", createDoctor);          // Create user
router.get("/doctor", getAllDoctors);             // Get all users
router.get("/doctor/:id", getDoctorById);       // Get user by ID
router.put("/doctor/:id", updateDoctor);        // Update user
router.get("/doctor/isactive/:id", toggleDoctorStatus);



router.post("/influencer", createInfluencer);          // Create user
router.get("/influencer", getAllInfluencers);             // Get all users
router.get("/influencer/:id", getInfluencerById);       // Get user by ID
router.put("/influencer/:id", updateInfluencer);        // Update user
router.get("/influencer/isactive/:id", toggleInfluencerStatus);     


export default router;
