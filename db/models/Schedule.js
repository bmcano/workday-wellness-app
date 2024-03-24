import { Schema, model } from 'mongoose';

const ScheduleSchema = new Schema({
    email: { type: String, required: true, unique: true },
    monday_start: { type: String, default: "08:00" },
    monday_end: { type: String, default: "17:00" },
    tuesday_start: { type: String, default: "08:00" },
    tuesday_end: { type: String, default: "17:00" },
    wednesday_start: { type: String, default: "08:00" },
    wednesday_end: { type: String, default: "17:00" },
    thursday_start: { type: String, default: "08:00" },
    thursday_end: { type: String, default: "17:00" },
    friday_start: { type: String, default: "08:00" },
    friday_end: { type: String, default: "17:00" },
});

const ScheduleModel = model("schedule", ScheduleSchema);
export default ScheduleModel;
