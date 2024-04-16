import { Schema, model } from 'mongoose';

const PrivacySchema = new Schema({
    email: { type: String, required: true, unique: true },
    publicProfile: { type: Boolean, default: true },
    birthday: { type: Boolean, default: true },
    about: { type: Boolean, default: true },
    linkedinLink: { type: Boolean, default: true },
    status: { type: Boolean, default: true },
    achievements: { type: Boolean, default: true },
});

const PrivacyModel = model('privacy', PrivacySchema);
export default PrivacyModel;