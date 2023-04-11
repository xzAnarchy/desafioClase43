import productosApi from '../../api/productosLocal.js'

export default async function configurarSocket(socket, sockets) {
    try {
        socket.emit('productos', await productosApi.listarAll());
    } catch (error) {
        logError(error.message)
        return []
    }

    socket.on('update', async producto => {
        try {
            await productosApi.guardar(producto)
        } catch (error) {
            logError(`error al guardar producto: ${error.message}`)
        }
        sockets.emit('productos', await productosApi.listarAll());
    })
}



/*
export default async function configurarSocket(socket, sockets) {
    socket.emit('productos', await productosApi.listarAll());

    socket.on('update', async producto => {
        await productosApi.guardar(producto)
        sockets.emit('productos', await productosApi.listarAll());
    })
}
*/