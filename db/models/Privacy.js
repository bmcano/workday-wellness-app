import { Schema, model } from 'mongoose';

const PrivacySchema = new Schema({
    email: { type: String, required: true, unique: true },
    publicProfile: { type: Boolean, default: true },
    birthdayPrivate: { type: Boolean, default: true },
    aboutPrivate: { type: Boolean, default: true },
    linkedinLinkPrivate: { type: Boolean, default: true },
});

const PrivacyModel = model('privacy', PrivacySchema);
export default PrivacyModel;