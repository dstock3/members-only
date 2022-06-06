const mongoose = require('mongoose');
const { DateTime } = require('luxon');

const Schema = mongoose.Schema;

const ReplySchema = new Schema({
  messageReply: {type: String, required: true, minLength: 1, maxLength: 500 },
  user: {type: Schema.Types.ObjectId, requried: true, ref: 'User' },
  timeStamp: {type: Date, required: true, default: Date.now },
  messageId: {type: Schema.Types.ObjectId, ref: 'Message'}
});

ReplySchema
  .virtual('getDate')
  .get(function () {
    return DateTime.fromJSDate(this.timeStamp).toFormat('dd LLL yyyy');
  });

ReplySchema
  .virtual('getTime')
  .get(function () {
    return DateTime.fromJSDate(this.timeStamp).toFormat('HH: mm')
  })

  module.exports = mongoose.model('Replies', ReplySchema);