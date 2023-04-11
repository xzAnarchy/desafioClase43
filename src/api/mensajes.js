import config from '../config/config.js'

import ContenedorArchivo from '../models/containers/ContenedorArchivo.js'

const mensajesApi = new ContenedorArchivo(`${config.fileSystem.path}/mensajes.json`)

export default mensajesApi