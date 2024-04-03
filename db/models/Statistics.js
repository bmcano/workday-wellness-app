import { Schema, model } from 'mongoose';

const StatisticsSchema = new Schema({
    email: { type: String, required: true, unique: true },
    full_name: { type: String, required: true },
    streak: { type: Number, default: 0 },
    lastCompleted: { type: Date, default: null },
    completed: {
        amount: { type: Number, default: 0 },
        exercises: [
            {
                exercise: { type: String },
                timestamp: { type: Date }
            }
        ]
    }
});

const StatisticsModel = model("statistics", StatisticsSchema);
export default StatisticsModel;
