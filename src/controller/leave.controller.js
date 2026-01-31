import Leave from "../model/leave.model.js";

/* ================= CREATE LEAVE ================= */
export const createLeave = async (req, res) => {
  try {
    const leave = await Leave.create(req.body);

    res.status(201).json({
      message: "Leave created successfully",
      data: leave,
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to create leave",
      error: error.message,
    });
  }
};

/* ================= GET ALL LEAVES (FILTER + PAGINATION) ================= */
export const getAllLeaves = async (req, res) => {
  try {
    const {
      status,
      assinedTo,
      leaveType,
      startDate,
      endDate,
      page = 1,
      limit = 10,
    } = req.query;

    const filter = {};

    // 🎯 Filters
    if (status) filter.status = status;
    if (assinedTo) filter.assinedTo = assinedTo;
    if (leaveType) filter.leaveType = leaveType;

    // 📅 Date range filter
    if (startDate || endDate) {
      filter.startDate = {};
      if (startDate) filter.startDate.$gte = new Date(startDate);
      if (endDate) filter.startDate.$lte = new Date(endDate);
    }

    const leaves = await Leave.find(filter)
      .populate("assinedTo", "firstName lastName email")
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Leave.countDocuments(filter);

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      limit: Number(limit),
      data: leaves,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= GET LEAVE BY ID ================= */
export const getLeaveById = async (req, res) => {
  try {
    const { id } = req.params;

    const leave = await Leave.findById(id)
      .populate("assinedTo", "firstName lastName email");

    if (!leave) {
      return res.status(404).json({
        message: "Leave not found",
      });
    }

    res.status(200).json({
      message: "Leave fetched successfully",
      data: leave,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid leave id",
      });
    }

    res.status(500).json({
      message: "Failed to fetch leave",
      error: error.message,
    });
  }
};

/* ================= UPDATE LEAVE ================= */
export const updateLeave = async (req, res) => {
  try {
    const { id } = req.params;

    const leave = await Leave.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!leave) {
      return res.status(404).json({
        message: "Leave not found",
      });
    }

    res.status(200).json({
      message: "Leave updated successfully",
      data: leave,
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to update leave",
      error: error.message,
    });
  }
};

/* ================= DELETE LEAVE ================= */
export const deleteLeave = async (req, res) => {
  try {
    const { id } = req.params;

    const leave = await Leave.findByIdAndDelete(id);

    if (!leave) {
      return res.status(404).json({
        message: "Leave not found",
      });
    }

    res.status(200).json({
      message: "Leave deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete leave",
      error: error.message,
    });
  }
};

/* ================= CHANGE LEAVE STATUS ================= */
export const changeLeaveStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({
        message: "Invalid status value",
      });
    }

    const leave = await Leave.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!leave) {
      return res.status(404).json({
        message: "Leave not found",
      });
    }

    res.status(200).json({
      message: "Leave status updated successfully",
      data: leave,
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to change leave status",
      error: error.message,
    });
  }
};
