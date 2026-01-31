import express from "express";
import { protect, authorize } from "../middleware/authMiddleware.js";

import {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
  changeJobStatus,
} from "../controller/job.controller.js";

const router = express.Router();

router.post("/",protect,authorize("client", "super_admin"), createJob);
router.get("/", getAllJobs);
router.get("/:id", getJobById);
router.put("/:id", updateJob);
router.delete("/:id", deleteJob);
router.patch("/:id/status", changeJobStatus);

export default router;
