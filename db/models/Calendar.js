import { Schema } from 'mongoose';

export const CalendarSchema = new Schema({
    title: { type: String, required: true},
    start: { type: Date, required: true},
    end: { type: Date, required: true}
})
