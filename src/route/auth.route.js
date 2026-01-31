import {
  signup,
  signin,
  logout,
  getProfile,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  changeUserStatus,
  createClient,
  createMember,
  loginClient,
  getClientById,
  deleteClient,
  changeClientStatus,
  updateClient,
  createInvite,
  getInviteByToken,
  acceptInvite,
  getMemberById,
  getAllMembers,
  updateMember,
  deleteMember,
  signinMember,
   getAllClientList,
  getAllClients,
  getAllMemberByClientId,
  getAllMemberListByClientId,
} from "../controller/auth.controller.js";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { Router } from "express";
import { upload } from "../middleware/upload.js";

const router = Router();
//

// Public
router.post("/signup", signup);
router.post("/signin", signin);
router.post("/logout", protect, logout);
router.post(
  "/client",
  protect,
  authorize("super_admin"),
  upload.fields([
    { name: "companyImg", maxCount: 1 },
    { name: "individualImg", maxCount: 1 },
  ]),
  createClient,
);
router.post("/login-client", loginClient);
router.get("/client/:id", protect, getClientById);
router.delete("/client/:id", protect, deleteClient);
router.patch("/client-status/:id", protect, changeClientStatus);
router.put(
  "/update-client/:id",
  upload.fields([
    { name: "companyImg", maxCount: 1 },
    { name: "individualImg", maxCount: 1 },
  ]),
  updateClient,
);

router.post(
  "/member",
  protect,
  authorize("client", "super_admin"),
  createInvite,
);
router.get("/member/:token",  getInviteByToken);
router.post(
  "/member/accept",
  
  upload.single("profileImg"),
  acceptInvite,
);
router.post("/signin/member", signinMember);

/**
 * GET all members
 */
router.get("/member", protect, authorize("client", "super_admin"), getAllMembers);

/**
 * GET member by ID
 */
router.get("/member/profile/:id", protect, authorize("client", "super_admin"), getMemberById);

/**
 * UPDATE member
 */
router.put(
  "/member/:id",
  protect,
  // authorize("client", "super_admin"),
  upload.single("profileImg"),
  updateMember,
);

/**
 * DELETE member
 */
router.delete(
  "/member/:id",
  protect,
  authorize("client", "super_admin"),
  deleteMember,
);

/**
 * CLIENT APIs
 */
router.get(
  "/clients/list",
  protect,
  // authorize("super_admin"),
  getAllClientList
);

router.get(
  "/clients",
  protect,
  // authorize("super_admin"),
  getAllClients
);

/**
 * MEMBER BY CLIENT APIs
 */
router.get(
  "/clients/:clientId/members",
  protect,
  // authorize("super_admin", "client"),
  getAllMemberByClientId
);

router.get(
  "/clients/:clientId/members/list",
  protect,
  // authorize("super_admin", "client"),
  getAllMemberListByClientId
);

// router.post("/member", protect, authorize("super_admin","user"), createMember);

// Role based APIs
router.get("/super_admin", protect, authorize("super_admin"), (req, res) => {
  res.json({
    success: true,
    message: "Welcome Admin",
    user: req.user,
  });
});

// router.get("/member", protect, authorize("member", "super_admin"), (req, res) => {
//   res.json({
//     success: true,
//     message: "Welcome User",
//     user: req.user,
//   });
// });
// Protected Routes
router.get("/profile", protect, getProfile);

// Admin Routes
router.get("/users", protect, authorize("super_admin"), getAllUsers);
router.get("/user/:userId", protect, authorize("super_admin"), getUserById);
// Additional admin routes for updating and deleting users
router.put("/user/:userId", protect, authorize("super_admin"), updateUser);
router.delete("/user/:userId", protect, authorize("super_admin"), deleteUser);
router.patch(
  "/user/:userId/status",
  protect,
  authorize("super_admin"),
  changeUserStatus,
);

export default router;
