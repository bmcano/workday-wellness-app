import UserModel from "../models/Users.js";
import StatusModel from "../models/UserStatus.js"; 
import { getUserInformation } from "./sessionController.js";

export const updateStatus = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const userData = getUserInformation(token);
        
        if (userData) {
            const { status } = req.body; 
            console.log("Received status:", status);

            const newStatus = new StatusModel({
                userId: userData._id, 
                email: userData.email,
                status: status,
                timestamp: new Date() 
            });

            await newStatus.save();

            return res.json({ success: true, message: "Status updated successfully." });
        } else {
            console.log("Authorization failed with token:", token);
            return res.status(401).json({ authorized: false, message: "Unauthorized access." });
        }
    } catch (error) {
        console.error("Error updating status:", error.message);
        return res.status(500).json({ message: "Error updating status.", error: error.message });
    }
};


export const getFriendsStatuses = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const userData = getUserInformation(token);

        if (!userData) {
            return res.status(401).json({ authorized: false, message: "Unauthorized access." });
        }

        const currentUser = await UserModel.findById(userData._id);
        if (!currentUser) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        const friendsStatuses = await StatusModel.find({
            email: { $in: currentUser.friends } 
        }).sort({ timestamp: -1 }); 

        return res.json({ success: true, friendsStatuses: friendsStatuses });

    } catch (error) {
        console.error("Error retrieving friends' statuses:", error.message);
        return res.status(500).json({ message: "Error retrieving friends' statuses.", error: error.message });
    }
};