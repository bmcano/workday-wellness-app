import { Schema, model } from 'mongoose';
import mongoose from 'mongoose';

const StatusSchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    status: { type: String, required: true },
    timestamp: { type: Date, required: true }
});

const StatusModel = model("status", StatusSchema);
export default StatusModel;