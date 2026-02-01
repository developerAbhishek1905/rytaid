
import { User } from "../model/user.model.js";
import { Client } from "../model/client.model.js";
import jwt from "jsonwebtoken";
import Invite from "../model/invite.model.js";
import crypto from "crypto";
import Member from "../model/member.model.js";
import mongoose from "mongoose";


// 🔑 Generate Token
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// create client/user accounts

// export const createUser = async (req, res) => {
//   if (req.user.role !== "super_admin") {
//     return res.status(403).json({ message: "Only super_admin can create user" });
//   }
//   if (!req.body.email || !req.body.password) {
//     return res.status(400).json({ message: "Email and password required" });
//   }

//   const existingUser = await User.findOne({ email: req.body.email });
//   if (existingUser) {
//     return res.status(400).json({ message: "User with this email already exists" });
//   }

//   const user = await Cli.create({
//     ...req.body,
//     role: "user",
//   });

//   res.status(201).json(user);
// };

export const createClient = async (req, res) => {
  try {
    const {
      // company info
      companyName,
      companyPhone,
      companyEmail,
      companyWebsite,
      address,
      streetAdreess1,
      
      country,
      state,
      city,
      pincode,
      note,
      primeryContactFirstName,
      primeryContactLastName,
      primeryContactEmail,
      primeryContactPhone,

      // individual info
      firstName,
      lastName,
      email,
      phone,
      individual_website,
      individual_address,
      individual_streetAdreess1,
      
      individual_country,
      individual_state,
      individual_city,
      individual_pincode,
      individual_note,

      password,
    } = req.body;

    // images
    const companyImg =
      req.files?.companyImg?.[0]?.path || null;

    const individualImg =
      req.files?.individualImg?.[0]?.path || null;

    const client = await Client.create({
      companyInfo: {
        companyName,
        companyPhone,
        companyEmail,
        companyWebsite,
        address,
        streetAdreess1,
    //    streetAdreess2,
        country,
        state,
        city,
        pincode,
        note,
        img: companyImg,
        primeryContactFirstName,
        primeryContactLastName,
        primeryContactEmail,
        primeryContactPhone,
      },
      individualInfo: {
        firstName,
        lastName,
        email,
        phone,
        individual_website,
        individaul_address: individual_address,
        individaul_streetAdreess1: individual_streetAdreess1,
        
        individual_country,
        individual_state,
        individual_city,
        individual_pincode,
        individual_note,
        individaul_img: individualImg,
      },
      password,
    });

    res.status(201).json({
      success: true,
      message: "Client created successfully",
      data: client,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};



export const loginClient = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // 🔍 find client by company OR individual email
    const client = await Client.findOne({
      $or: [
        { "companyInfo.companyEmail": email },
        { "individualInfo.email": email },
      ],
    });
    console.log(client)

    if (!client) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // 🔐 password match
    const isMatch = await client.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // 🎟 JWT token
    const token = jwt.sign(
      { id: client._id ,role: client.role},
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      data: {
        id: client._id,
        status: client.status,
        companyInfo: client.companyInfo,
        individualInfo: client.individualInfo,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


//create member by super_admin or user
export const createMember = async (req, res) => {
  const creator = req.user;
  

  if (!["user", "super_admin"].includes(creator.role)) {
    return res.status(403).json({ message: "Not allowed" });
  }

  // userId must be passed if super_admin is creating
  const assignedUserId =
    creator.role === ("user") ? creator.id : req.body.createdByUser;


  if (!assignedUserId) {
    return res.status(400).json({ message: "User ID required" });
  }

  const member = await User.create({
    ...req.body,
    role: "member",
    createdByUser: assignedUserId,
  });

  // push member into user's members array
  await User.findByIdAndUpdate(assignedUserId, {
    $push: { members: member._id },
  });

  res.status(201).json(member);
};

export const getClientById = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id)
      .populate("companyInfo.country companyInfo.state companyInfo.city companyInfo.pincode")
      .populate("team");

    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    res.status(200).json({
      success: true,
      data: client,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const deleteClient = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);

    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    await client.deleteOne();

    res.status(200).json({
      success: true,
      message: "Client deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const changeClientStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["active", "inactive"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const client = await Client.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Status updated successfully",
      data: client.status,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const updateClient = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);

    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    // images (optional)
    if (req.files?.companyImg) {
      client.companyInfo.img = req.files.companyImg[0].path;
    }

    if (req.files?.individualImg) {
      client.individualInfo.individaul_img =
        req.files.individualImg[0].path;
    }

    // update companyInfo
    Object.assign(client.companyInfo, req.body.companyInfo || {});
    Object.assign(client.individualInfo, req.body.individualInfo || {});

    // password update (optional)
    if (req.body.password) {
      client.password = req.body.password;
    }

    await client.save();

    res.status(200).json({
      success: true,
      message: "Client updated successfully",
      data: client,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



export const createInvite = async (req, res) => {
  console.log(req.user)
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      role,
      note,
      address,
      streetAddress,
      country,
      state,
      city,
      pincode,

      // only super_admin will send this
      assignTo: assignToFromBody,
    } = req.body;
    
    let assignTo;

    // 🔐 ROLE BASED ASSIGNMENT
    if (req.user.role === "client") {
      // client creating member → auto assign
      assignTo = req.user._id;
    } else if (req.user.role === "super_admin") {
      // super admin must provide clientId
      if (!assignToFromBody) {
        return res
          .status(400)
          .json({ message: "Client ID is required for assignment" });
      }
      assignTo = assignToFromBody;
    }

    const token = crypto.randomBytes(32).toString("hex");
    const inviteId = new mongoose.Types.ObjectId();

    const invite = await Invite.create({
      _id: inviteId,
      firstName,
      lastName,
      email,
      phone,
      role,
      note,
      address,
      streetAddress,
      country,
      state,
      city,
      pincode,
      assignTo,
      token,
      expiresAt: Date.now() + 24 * 60 * 60 * 1000,
    });

    // 🔗 push invite into client
    await Client.findByIdAndUpdate(assignTo, {
      $push: { invites: invite._id },
    });

    const link = `${process.env.FRONTEND_URL}/accept-invite/${token}`;
    // sendEmail(email, link)

    res.status(201).json({
      message: "Member invite sent successfully",
      inviteId: invite._id,
      token
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /invite/:token
export const getInviteByToken = async (req, res) => {
  const invite = await Invite.findOne({
    token: req.params.token,
    expiresAt: { $gt: Date.now() },
  });

  if (!invite) {
    return res.status(400).json({ message: "Invalid or expired invite" });
  }

  res.json(invite); // prefill frontend form
};


export const acceptInvite = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ message: "Token & password required" });
    }

    const invite = await Invite.findOne({ token });

    if (!invite) {
      return res.status(400).json({ message: "Invite not found or expired" });
    }

    // 🔐 only allow specific fields to be updated
    const allowedUpdates = {
      firstName: req.body.firstName ?? invite.firstName,
      lastName: req.body.lastName ?? invite.lastName,
      phone: req.body.phone ?? invite.phone,
      note: req.body.note ?? invite.note,
      address: req.body.address ?? invite.address,
      streetAddress: req.body.streetAddress ?? invite.streetAddress,
      country: req.body.country ?? invite.country,
      state: req.body.state ?? invite.state,
      city: req.body.city ?? invite.city,
      pincode: req.body.pincode ?? invite.pincode,
    };

    const member = new Member({
      _id: invite._id,               // SAME ID
      email: invite.email,           // LOCKED
      role: invite.role,             // LOCKED
      assignTo: invite.assignTo,     // LOCKED
      password,

      ...allowedUpdates,

      profileImg: req.file
        ? `/uploads/members/${req.file.filename}`
        : null,
    });

    await member.save();

    // 🧹 cleanup
    await Invite.deleteOne({ _id: invite._id });

    // await Client.findByIdAndUpdate(invite.assignTo, {
    //   $pull: { invites: invite._id },
    // });

    res.status(201).json({
      message: "Member account created successfully",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const signinMember = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const member = await Member.findOne({ email });

    if (!member) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await member.comparePassword?.(password) ||
      await (await import("bcryptjs")).default.compare(password, member.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(member._id, member.role);

    res.json({
      message: "Login successful",
      token,
      member: {
        _id: member._id,
        firstName: member.firstName,
        lastName: member.lastName,
        email: member.email,
        role: member.role,
        assignTo: member.assignTo,
        profileImg: member.profileImg,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
/**
 * GET ALL MEMBERS
 */
export const getAllMembers = async (req, res) => {
  try {
    const filter =
      req.user.role === "super_admin"
        ? {}
        : { assignTo: req.user._id };

    const members = await Member.find(filter)
      .populate("country state city pincode")
      .populate("assignTo", "companyInfo.companyName");

    res.json(members);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * GET MEMBER BY ID
 */
export const getMemberById = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id)
      .populate("country state city pincode")
      .populate("assignTo", "companyInfo.companyName");

    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    // 🔐 ownership check
    if (
      req.user.role === "client" &&
      member.assignTo.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(member);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * UPDATE MEMBER
 */
export const updateMember = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);

    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    // 🔐 ownership check
    if (
      req.user.role === "client" &&
      member.assignTo.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    // ❌ fields that cannot be changed
    const blockedFields = ["email", "assignTo", "role", "password"];
    blockedFields.forEach((field) => delete req.body[field]);

    // ✅ allowed updates
    Object.assign(member, req.body);

    if (req.file) {
      member.profileImg = `/uploads/members/${req.file.filename}`;
    }

    await member.save();

    res.json({ message: "Member updated successfully", member });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * DELETE MEMBER
 */
export const deleteMember = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);

    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    // 🔐 ownership check
    if (
      req.user.role === "client" &&
      member.assignTo.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    await member.deleteOne();

    res.json({ message: "Member deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


/**
 * 1️⃣ Get All Client List (Minimal)
 */
export const getAllClientList = async (req, res) => {
  try {
    const clients = await Client.find({})
      .select("_id companyInfo.companyName companyInfo.companyEmail");

    const formatted = clients.map((c) => ({
      _id: c._id,
      name: c.companyInfo.companyName,
      email: c.companyInfo.companyEmail,
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * 2️⃣ Get All Clients (Full)
 */
export const getAllClients = async (req, res) => {
  try {
    const clients = await Client.find({})
      .populate("companyInfo.country companyInfo.state companyInfo.city companyInfo.pincode");

    res.json(clients);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * 3️⃣ Get All Members By Client ID (Full)
 */
export const getAllMemberByClientId = async (req, res) => {
  try {
    const { clientId } = req.params;

    // 🔐 client can only access their own members
    if (
      req.user.role === "client" &&
      req.user._id.toString() !== clientId
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    const members = await Member.find({ assignTo: clientId })
      .populate("country state city pincode");

    res.json(members);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * 4️⃣ Get All Member List By Client ID (Minimal)
 */
export const getAllMemberListByClientId = async (req, res) => {
  try {
    const { clientId } = req.params;

    if (
      req.user.role === "client" &&
      req.user._id.toString() !== clientId
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    const members = await Member.find({ assignTo: clientId })
      .select("_id firstName lastName email");

    const formatted = members.map((m) => ({
      _id: m._id,
      name: `${m.firstName} ${m.lastName}`,
      email: m.email,
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// SIGNUP (User / Admin)
export const signup = async (req, res) => {
  try {
    const { firstName,
  lastName,
  email,
  phone,
  role,
  position,
  
  notes,
  enforcedScheduledJobs,
  address,
  streetAddress,
  country,
  state,
  city,
  pincode,
  password} = req.body;

    if ( !firstName|| !lastName ||!password || (!email && !phone)) {
      return res.status(400).json({
        success: false,
        message: "firstName, lastName, password and email or phone required",
      });
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { phone }],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const user = await User.create({
      firstName,
  lastName,
  email,
  phone,

  position,
  notes,
  enforcedScheduledJobs,
  address,
  streetAddress,
  country,
  
  state,
  city,
  pincode,
  password,
      role: role || "member",
    });

    res.status(201).json({
      success: true,
      message: "Signup successful",
      token: generateToken(user),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// SIGNIN (email OR phone + password)
export const signin = async (req, res) => {
  try {
    const { email, phone, password } = req.body;

    if ((!email && !phone) || !password) {
      return res.status(400).json({
        success: false,
        message: "Email/Phone and password required",
      });
    }

    const user = await User.findOne({
      $or: [{ email }, { phone }],
    }).select("+password");

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    res.status(200).json({
      success: true,
      message: "Login successful",
      token: generateToken(user),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// LOGOUT
export const logout = async (req, res) => {
  res.status(200).json({
    success: true,
    message: "Logged out successfully (client should delete token)",
  });
};

// GET CURRENT USER PROFILE
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

//GET ALL USERS (Admin)
export const getAllUsers = async (req, res) => {
  try {
    const {
      search,
      status,
      position,
      enforcedScheduledJobs,
      country,
      state,
      city,
      page = 1,
      limit = 10,
    } = req.query;

    // ✅ Base filter: ONLY members
    const filter = {
      role: "member",
    };

    // 🔍 Search filter
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }

    // 🎯 Exact match filters
    if (status) filter.status = status;
    if (position) filter.position = position;
    if (country) filter.country = country;
    if (state) filter.state = state;
    if (city) filter.city = city;

    // 🔘 Boolean filter (string → boolean)
    if (enforcedScheduledJobs !== undefined) {
      filter.enforcedScheduledJobs =
        enforcedScheduledJobs === "true";
    }

    const users = await User.find(filter)
      .select("-password") // 🔐 hide password
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(filter);

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      limit: Number(limit),
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


//GET USER BY ID (Admin)
export const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//UPDATE USER (Admin)
export const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const updates = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    Object.keys(updates).forEach((key) => {
      user[key] = updates[key];
    });

    await user.save();

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// DELETE USER (Admin)
export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//CHANGE STATUS (Admin)
export const changeUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { status } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.status = status;
    await user.save();

    res.status(200).json({
      success: true,
      message: "User status updated successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
