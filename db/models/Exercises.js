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
    neck_flexion_and_extension: createRepsSchema(15),
    neck_retraction: createTimeRepsSchema(5,10),
    neck_rotation: createRepsSchema(20),
    on_the_ground_figure_four: createTimeRepsSchema(5,10),
    spinal_twist: createRepsSchema(15),
    shoulder_rolls: createRepSchema(15),
    horizontal_abduction: createTimeRepsSchema(10,5),
    seated_lower_back: createTimeRepsSchema(5,20),
    wrist_rolls: createRepsSchema(25),
    finger_to_palm: createTimeRepsSchema(5,5),
    // exercises
    squats: createRepsSchema(10),
    lunges: createRepsSchema(5),
    jumping_jacks: createRepsSchema(20),
    push_ups: createRepsSchema(5),
    walks: createTimeSchema(600),
    // misc
    meditation: createTimeSchema(300),
    sun_exposure: createTimeSchema(300),
    standing_at_work: createRepsSchema(1200),
    posture_reminder: createRepsSchema(5),
});
