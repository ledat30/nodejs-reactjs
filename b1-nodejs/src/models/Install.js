const mongoose = require('mongoose');

const installEventSchema = new mongoose.Schema({
  application_token: { type: String, required: true, unique: true },
  installed_at: { type: Date, default: Date.now },
  is_first_install: { type: Boolean, default: true },
});

module.exports = mongoose.model('InstallEvent', installEventSchema);