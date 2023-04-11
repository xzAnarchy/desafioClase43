import config from '../config/config.js'

import ContenedorArchivo from '../models/containers/ContenedorArchivo.js'

const productosApi = new ContenedorArchivo(`${config.fileSystem.path}/products.json`)

export default productosApi