const mongoose = require('mongoose')
const reqStr = {
  type: String,
  required: true,}
const setupSchema = mongoose.Schema({
    userID: reqStr,
    userName: reqStr,
    channel: [String],
    role: [String],
    })
module.exports = mongoose.model('Alerts', setupSchema)