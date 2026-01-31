import Site  from "../model/site.model.js";

/* ================= CREATE SITE ================= */
export const createSite = async (req, res) => {
  try {
    const lastSite = await Site.findOne().sort({ site_id: -1 });

    const nextSiteId = lastSite ? lastSite.site_id + 1 : 1;

    const site = await Site.create({
      ...req.body,
      site_id: nextSiteId,
    });

    res.status(201).json({
      message: "Site created successfully",
      data: site,
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to create site",
      error: error.message,
    });
  }
};


/* ================= GET SITES (SEARCH + FILTER) ================= */
export const getSites = async (req, res) => {
  try {
    const {
      search,
      status,
      city_id,
      state_id,
      client_id,
      page = 1,
      limit = 10,
    } = req.query;

    const filter = {};

    // 🔍 Search
    if (search) {
      filter.$or = [
        { site_name: { $regex: search, $options: "i" } },
        { notes: { $regex: search, $options: "i" } },
      ];
    }

    // 🎯 Filters
    if (status) filter.status = status;
    if (city_id) filter.city_id = city_id;
    if (state_id) filter.state_id = state_id;
    if (client_id) filter.client_id = client_id;

    const sites = await Site.find(filter)
      .populate("client_id", "name email")
      .populate("assignedTo", "email firstName lastName")
      .populate("country_id", "name code countryId")
      .populate("state_id", "state_name country_id state_id")
      .populate("city_id", "city_name city_id state_id")
      .populate("pincode_id", "pincode_name city_id pincode_id")
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ _id: -1 });

    const total = await Site.countDocuments(filter);

    res.json({
      total,
      page: Number(page),
      limit: Number(limit),
      data: sites,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch sites",
      error: error.message,
    });
  }
};

export const getAllSiteList = async (req, res)=>{
try {
    const clients = await Site.find({})
        .select("_id site_name");
  
      const formatted = clients.map((site) => ({
        _id: site._id,
        name: site.site_name,
        
      }));
  
      res.json(formatted);
}
catch(error){
res.status(500).json({
  message: "Failed to fetch sites",
  error:error.message
})
}
}

/* ================= UPDATE SITE ================= */
export const updateSite = async (req, res) => {
  try {
    const { id } = req.params;

    const site = await Site.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!site) {
      return res.status(404).json({ message: "Site not found" });
    }

    res.json({
      message: "Site updated successfully",
      data: site,
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to update site",
      error: error.message,
    });
  }
};

/* ================= DELETE SITE ================= */
export const deleteSite = async (req, res) => {
  try {
    const { id } = req.params;

    const site = await Site.findByIdAndDelete(id);

    if (!site) {
      return res.status(404).json({ message: "Site not found" });
    }

    res.json({
      message: "Site deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete site",
      error: error.message,
    });
  }
};

/* ================= CHANGE STATUS ================= */
export const changeSiteStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const site = await Site.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!site) {
      return res.status(404).json({ message: "Site not found" });
    }

    res.json({
      message: "Status updated successfully",
      data: site,
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to change status",
      error: error.message,
    });
  }
};

/* ================= GET SITE BY ID ================= */


export const getSiteById = async (req, res) => {
  try {
    const { id } = req.params;

    const site = await Site.findById(id)
      .populate("client_id", "name email")
      .populate("assignedTo", "email lastName firstName");

    if (!site) {
      return res.status(404).json({
        message: "Site not found",
      });
    }

    res.status(200).json({
      message: "Site fetched successfully",
      data: site,
    });
  } catch (error) {
    // Handle invalid ObjectId
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid site id",
      });
    }

    res.status(500).json({
      message: "Failed to fetch site",
      error: error.message,
    });
  }
};
