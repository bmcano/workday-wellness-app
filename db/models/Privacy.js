const mongoose = require('mongoose');

const PrivacySchema = new mongoose.Schema({
    publicProfile: { type: Boolean, default: true },
    birthdayPrivate: { type: Boolean, default: true },
    aboutPrivate: { type: Boolean, default: true },
    linkedinLinkPrivate: { type: Boolean, default: true },
});

module.exports = mongoose.model('Privacy', PrivacySchema);