import { Schema } from 'mongoose';

export const AcivitySchema = new Schema({
    status: { type: String, required: true },
    timestamp: { type: Date, required: true },

})
