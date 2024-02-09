import { Schema, model } from 'mongoose';

const ExerciseSchema = new Schema({
    email: { type: String, required: true, unique: true },
    neck_strectches: [
        {
            title: { type: String, required: true },
            reps: { type: Number, default: 5 },
            isEnabled: { type: Boolean, default: true },
        },
    ],
    back_strectches: [
        {
            title: { type: String, required: true },
            reps: { type: Number, default: 5 },
            isEnabled: { type: Boolean, default: true },
        },
    ],
    wrist_strectches: [
        {
            title: { type: String, required: true },
            reps: { type: Number, default: 5 },
            isEnabled: { type: Boolean, default: true },
        },
    ],
    movement_exercises: [
        {
            title: { type: String, required: true },
            reps: { type: Number, default: 5 },
            isEnabled: { type: Boolean, default: true },
        },
    ],
});

const ExerciseModel = model("exercises", ExerciseSchema);
export default ExerciseModel;