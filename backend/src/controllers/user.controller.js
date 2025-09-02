import FriendRequest from "../models/FriendRequest.js";
import User from "../models/User.js";

export async function getRecommentedUsers(req, res) {
  try {
    const currentUserId = req.user.id;
    const currentUser = req.user;
    const recommendedUsers = await User.find({
      $and: [
        { _id: { $ne: currentUserId } },
        { _id: { $nin: currentUser.friends } },
        { _isOnboarded: true },
      ],
    });
    res.status(200).json(recommendedUsers);
  } catch (error) {
    console.error("Errror iiin getRecommendedUser Controller ", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}
export async function getMyFriends(req, res) {
  try {
    const user = await User.findById(req.user.id)
      .select("friends")
      .populate(
        "friends",
        "fullName profiilePic,nativeLanguage,learningLanguage"
      );
    res.status(200).json(user.friends);
  } catch (error) {}
}

export async function sendFriendRequest(req, res) {
  try {
    const myId = req.user.id;
    const { id: recpientId } = req.params;
    if (myId === recpientId) {
      return res
        .status(400)
        .json({ message: "You can't sned friend request to yourself" });
    }
    const recipiient = await User.findById(recpientId);
    if (!recipiient) {
      return res.status(404).json({ message: "Recipient not found" });
    }

    if (recipiient.friends.includes(myId)) {
      return res
        .status(400)
        .json({ message: "You are already friendd with this user" });
    }
    const existingRequest = await FriendRequest.findOne({
      $or: [
        { sender: myId, recipient: recpientId },
        { sender: recpientId, recipient: myId },
      ],
    });
    if (existingRequest) {
      return res.status(400).json({
        message: "A friend request already exists between you and thiis user",
      });
    }
    const friendRequest = await FriendRequest.create({
      sender: myId,
      recipient: recpientId,
    });
    res.status(201).json(friendRequest);
  } catch (error) {
    console.error("Errror iiin frienrequest  Controller ", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function acceptFriendRequest(req, res) {
  try {
    const { id: requestId } = req.params;
    const friendRequest = await FriendRequest.findById(requestId);
    if (!friendRequest) {
      return res.status(404).json({ message: "friend request not found" });
    }

    if (friendRequest.recipient.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "you're not authorized to accept this requuest" });
    }
    friendRequest.status = "accepted";
    await friendRequest.save();
    await User.findByIdAndUpdate(friendRequest.sender, {
      $addToSet: { friends: friendRequest.recipient },
    });
    await User.findByIdAndUpdate(friendRequest.recipient, {
      $addToSet: { friends: friendRequest.sender },
    });
    res.status(200).json({ message: "Friend request accepted" });
  } catch (error) {
    console.error("Errror in acceptfrienrequest  Controller ", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getFriendRequest(req, res) {
  try {
    const incomingRequest = await FriendRequest.find({
      recipient: req.user.id,
      status: "pending",
    }).populate(
      "sender",
      "fullName profilePic nativeLanguage learningLanguage"
    );
    const acceptedRequest = await FriendRequest.find({
      sender: req.user.id,
      status: "accepted",
    }).populate("recipient", "fullName profilePic");
    res.status(200).json({ incomingRequest, acceptedRequest });
  } catch (error) {
    console.error("Errror in get frienrequest  Controller ", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getOutgoingFriendRequest(req, res) {
  try {
    const outGoingReq = await FriendRequest.find({
      sender: req.user.id,
      status: "pending",
    }).populate(
      "sender",
      "fullName profilePic nativeLanguage learningLanguage"
    );
    res.status(200).json(outGoingReq);
  } catch (error) {
    console.error("Errror in outgoingreq Controller ", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}
