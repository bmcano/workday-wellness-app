import { Schema,model } from 'mongoose';

export const StatusSchema = new Schema({
    status: { type: String, required: true },
    timestamp: { type: Date, required: true },
})

const StatusModel = model("userStatus", StatusSchema);
export default StatusModel;