import { Schema, model } from 'mongoose';
import mongoose from 'mongoose';

const StatusSchema = new Schema({
    //should probably add the name of the user
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    email: { type: String, required: true, unique: true },
    status: { type: String, required: true },
    timestamp: { type: Date, required: true },
    
});
const StatusModel = model("userStatus", StatusSchema);
export default StatusModel;