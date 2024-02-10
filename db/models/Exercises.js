import { Schema } from 'mongoose';

const createTimeSchema = (time) => {
    return new Schema({
        id: { type: Number },
        name: { type: String },
        values: {
            time: { type: Number, default: time }
        },
        isEnabled: { type: Boolean, default: true }
    });
}

const createRepsSchema = (reps) => {
    return new Schema({
        id: { type: Number },
        name: { type: String },
        values: {
            reps: { type: Number, default: reps }
        },
        isEnabled: { type: Boolean, default: true }
    });
}

const createTimeRepsSchema = (time, reps) => {
    return new Schema({
        id: { type: Number },
        name: { type: String },
        values: {
            time: { type: Number, default: time },
            reps: { type: Number, default: reps },
        },
        isEnabled: { type: Boolean, default: true }
    });
}

export const ExercisesSchema = new Schema({
    // stretches
    neck_flexion_and_extension: createTimeSchema(30),
    neck_retraction: createTimeSchema(30),
    neck_rotation: createTimeSchema(30),
    on_the_ground_figure_four: createTimeSchema(30),
    spinal_twist: createTimeSchema(30),
    shoulder_rolls: createTimeSchema(30),
    horizontal_abduction: createTimeSchema(30),
    seated_lower_back: createTimeSchema(30),
    wrist_rolls: createTimeRepsSchema(10, 2),
    finger_to_palm: createTimeSchema(30),
    // exercises
    squats: createRepsSchema(30),
    lunges: createRepsSchema(30),
    jumping_jacks: createRepsSchema(30),
    push_ups: createRepsSchema(30),
    walks: createTimeSchema(30),
    // misc
    meditation: createTimeSchema(30),
    sun_exposure: createTimeSchema(30),
    standing_at_work: createRepsSchema(10),
    posture_reminder: createRepsSchema(5),
});
