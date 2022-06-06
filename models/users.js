const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {type: String, required: true, minLength: 4, maxLength: 20},
  password: {type: String, required: true, minLength: 5 },
  admin: {type: Boolean, default: false},
  member: {type: Boolean, default: false},
  messages:[{type: Schema.Types.ObjectId, ref: 'Message'}]
});

UserSchema
  .virtual('getProfileUrl')
  .get(function () {
    const url = '/members/' + this._id
    return url
  });

module.exports = mongoose.model('User', UserSchema);