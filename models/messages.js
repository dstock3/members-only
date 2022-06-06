const mongoose = require('mongoose');
const { DateTime } = require('luxon');

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  title: {type: String, required: true, minLength: 1, maxLength: 50},
  message: {type: String, required: true, minLength: 1, maxLength: 1000},
  user: {type: Schema.Types.ObjectId, required: true, ref: 'User' },
  timeStamp:{type: Date, required: true, default: Date.now },
  replies: [{type: Schema.Types.ObjectId, ref: 'Replies'}],
});

MessageSchema
  .virtual('getDate')
  .get(function () {
    return DateTime.fromJSDate(this.timeStamp).toFormat('dd LLL yyyy');
  });

MessageSchema
  .virtual('getTime')
  .get(function () {
    return DateTime.fromJSDate(this.timeStamp).toFormat('HH: mm')
  })

module.exports = mongoose.model('Message', MessageSchema);