const mongoose = require('mongoose')

const mensajesSchema = new mongoose.Schema({
  author: {
    mail: { type: String, required: true },
    name: { type: String, required: true },
    lastName: { type: String, required: true },
    age: { type: String, required: true },
    username: { type: String, required: true },
    avatar: { type: String, required: true },
  },
  text: { type: String, required: true },
  date: { type: String, required: true }
})

export default mongoose.model('mensajes', mensajesSchema)