import mongoose from 'mongoose'

const usuariosSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
})

const UsuariosModel = mongoose.model('usuarios', usuariosSchema)

export default UsuariosModel