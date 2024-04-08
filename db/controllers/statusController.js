import UserModel from "../models/Users.js";
import { getUserInformation } from "./sessionController.js";

export const updateStatus = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const userData = getUserInformation(token);
        
        if (userData) {
            const { status } = req.body; 
            console.log("Received status:", status);

            const user = await UserModel.findOne({ email: userData.email });

            if (user) {
                // Create a new status object
                const newStatus = {
                    status: status,
                    timestamp: new Date() // Set the current timestamp
                };

                // Push the new status to the user's last_status array
                user.last_status.push(newStatus);

                // Save the updated user document
                await user.save();

                return res.json({ success: true, message: "Status updated successfully." });
            } else {
                console.log("User not found with email:", userData.email);
                return res.status(404).json({ success: false, message: "User not found." });
            }
        } else {
            console.log("Authorization failed with token:", token);
            return res.status(401).json({ authorized: false, message: "Unauthorized access." });
        }
    } catch (error) {
        console.error("Error updating status:", error.message);
        return res.status(500).json({ message: "Error updating status.", error: error.message });
    }
};

export const getFriendsStatus = async (req, res) => {

}