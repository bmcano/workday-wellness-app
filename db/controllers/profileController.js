import UserModel from '../models/Users.js';

/**
 * Job: Backend API calls directly regarding the user profile.
 */

export const getUser = async (req, res) => {
    try {
        if (req.session._id) {
            const user = await UserModel.findOne({ _id: req.session._id }).lean();
            return res.json({ authorized: true, user: user });
        } else {
            return res.json({ authorized: false });
        }
    } catch (error) {
        console.log(error);
        return res.json({ authorized: false });
    }
}

export const uploadProfilePicture = async (req, res) => {
    try {
        const base64Image = req.body.base64Image;
        const user = await UserModel.findById(req.session._id);
        user.profile_picture = base64Image;
        await user.save();
        return res
            .status(200)
            .send("Image uploaded successfully");
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .send("Error uploading picture.");
    }
}

export const getExerciseInformation = async (req, res) => {
    try {
        const user = await UserModel.findById(req.session._id);
        return res.json(user.exercises);
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .send("Error finding user information.");
    }
}

export const updateExerciseInformation = async (req, res) => {

}
