import express from "express";
import {
  createLeave,
  getAllLeaves,
  getLeaveById,
  updateLeave,
  deleteLeave,
  changeLeaveStatus,
} from "../controller/leave.controller.js";

const router = express.Router();

router.post("/", createLeave);
router.get("/", getAllLeaves);
router.get("/:id", getLeaveById);
router.put("/:id", updateLeave);
router.delete("/:id", deleteLeave);
router.patch("/:id/status", changeLeaveStatus);

export default router;
