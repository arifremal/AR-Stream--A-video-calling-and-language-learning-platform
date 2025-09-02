import express from 'express'
import { protectRoute } from "../middleware/auth.middleware.js";
import { acceptFriendRequest, getFriendRequest, getMyFriends, getOutgoingFriendRequest, getRecommentedUsers, sendFriendRequest } from '../controllers/user.controller.js';

const router = express.Router()

router.use(protectRoute)

router.get("/",getRecommentedUsers)
router.get("/friends",getMyFriends)
router.post("/friend-request/:id",sendFriendRequest)
router.put("/friend-request/:id/accept",acceptFriendRequest)
router.get("/friend-requests",getFriendRequest)
router.get("/outgoing-friend-requests",getOutgoingFriendRequest)

export default router;