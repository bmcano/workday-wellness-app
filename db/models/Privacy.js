import { Schema, model } from 'mongoose';

const PrivacySchema = new Schema({
    publicProfile: { type: Boolean, default: true },
    birthdayPrivate: { type: Boolean, default: true },
    aboutPrivate: { type: Boolean, default: true },
    linkedinLinkPrivate: { type: Boolean, default: true },
});

const PrivacyModel = model('Privacy', PrivacySchema);
export default PrivacyModel;