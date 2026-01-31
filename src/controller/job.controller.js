import  Job  from "../model/job.model.js";

/* ================= CREATE JOB ================= */
export const createJob = async (req, res) => {
  try {
    const job = await Job.create(req.body);

    res.status(201).json({
      message: "Job created successfully",
      data: job,
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to create job",
      error: error.message,
    });
  }
};

/* ================= GET ALL JOBS (FILTER + PAGINATION) ================= */
export const getAllJobs = async (req, res) => {
  try {
    const {
      search,
      status,
      assignedTo,
      client,
      site_id,
      startDate,
      endDate,
      page = 1,
      limit = 10,
    } = req.query;

    const filter = {};

    // 🎯 Filters
    if (status) filter.status = status;
    if (assignedTo) filter.assignedTo = assignedTo;
    if (client) filter.client = client;
    if (site_id) filter.site_id = site_id;

    // 📅 Date range filter
    if (startDate || endDate) {
      filter.startDate = {};
      if (startDate) filter.startDate.$gte = new Date(startDate);
      if (endDate) filter.startDate.$lte = new Date(endDate);
    }

    // 🔍 Notes search
    if (search) {
      filter.notes = { $regex: search, $options: "i" };
    }

    const jobs = await Job.find(filter)
      .populate("assignedTo", "firstName lastName email")
      .populate("client", "firstName lastName email")
      .populate("site_id", "site_id site_name")
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Job.countDocuments(filter);

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      limit: Number(limit),
      data: jobs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= GET JOB BY ID ================= */
export const getJobById = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await Job.findById(id)
      .populate("assignedTo", "firstName lastName email")
      .populate("client", "firstName lastName email")
      .populate("site_id", "site_id site_name");

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    res.status(200).json({
      message: "Job fetched successfully",
      data: job,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid job id" });
    }

    res.status(500).json({
      message: "Failed to fetch job",
      error: error.message,
    });
  }
};

/* ================= UPDATE JOB ================= */
export const updateJob = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await Job.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    res.status(200).json({
      message: "Job updated successfully",
      data: job,
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to update job",
      error: error.message,
    });
  }
};

/* ================= DELETE JOB ================= */
export const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await Job.findByIdAndDelete(id);

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    res.status(200).json({
      message: "Job deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete job",
      error: error.message,
    });
  }
};

/* ================= CHANGE JOB STATUS ================= */
export const changeJobStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({
        message: "Invalid status value",
      });
    }

    const job = await Job.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    res.status(200).json({
      message: "Job status updated successfully",
      data: job,
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to change job status",
      error: error.message,
    });
  }
};
