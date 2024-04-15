import { Schema, model } from 'mongoose';

export const AchievementSchema = new Schema({
    MadeFriend: { type: Boolean, required: true },
    OneDayStreak: { type: Boolean, required: true },
    TenDayStreak: { type: Boolean, required: true },
    HundredDayStreak: { type: Boolean, required: true },
    OneDayEx: { type: Boolean, required: true },
    TenDayEx: { type: Boolean, required: true },
    HundredDayEx: { type: Boolean, required: true }
});

const AchievementsModel = model("achivements", AchievementSchema);
export default AchievementsModel;
