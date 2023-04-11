import cluster from 'cluster'
import compression from 'compression'
import MongoStore from 'connect-mongo'
import cookieParser from 'cookie-parser'
import express from 'express'
import session from 'express-session'
import os from 'os'
import passport from 'passport'

import { logInfo, logWarning } from './src/loggers/index.js'

import config from './src/config/config.js'

import path from 'path'
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { Server as HttpServer } from 'http'
import { Server as Socket } from 'socket.io'

import productosApiRouter from './src/routers/api/productos.js'
import randomsApiRouter from './src/routers/api/randoms.js'
import authWebRouter from './src/routers/web/auth.js'
import homeWebRouter from './src/routers/web/home.js'
import infoWebRouter from './src/routers/web/info.js'

import addMensajesHandlers from './src/routers/ws/mensajes.js'
import addProductosHandlers from './src/routers/ws/productos.js'

import objectUtils from './src/utils/objectUtils.js'

//--------------------------------------------
// instancio servidor, socket , api y passport

const app = express()
const httpServer = new HttpServer(app)
const io = new Socket(httpServer)

//--------------------------------------------
// configuro el socket

io.on('connection', async socket => {
    // console.log('Nuevo cliente conectado!');
    addProductosHandlers(socket, io.sockets)
    addMensajesHandlers(socket, io.sockets)
});

//--------------------------------------------
// configuro el servidor

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
// app.use(express.static(path.join(__dirname, 'public')))
app.use(compression())

app.set('view engine', 'ejs');

app.use(cookieParser())
// app.use(objectUtils.createOnMongoStore())
app.use(session(config.session))

app.use(passport.initialize())
app.use(passport.session())
// app.use(session({
//     // store: MongoStore.create({ mongoUrl: config.mongoLocal.cnxStr }),
//     store: MongoStore.create({ mongoUrl: config.mongoRemote.cnxStr }),
//     secret: 'shhhhhhhhhhhhhhhhhhhhh',
//     resave: false,
//     saveUninitialized: false,
//     rolling: true,
//     cookie: {
//         maxAge: 60000
//     }
// }))

// MIDDLEWARE PASSPORT
app.use(passport.initialize())
app.use(passport.session())
//--------------------------------------------

import auth from './src/routers/web/auth.js'
const sessions = auth
app.use('/api/sessions', sessions)
//req.session.passport.user

//--------------------------------------------
// rutas del servidor API REST

app.use(productosApiRouter)
app.use(randomsApiRouter)

//--------------------------------------------
// rutas del servidor web

app.use(authWebRouter)
app.use(homeWebRouter)
app.use(infoWebRouter)

//--------------------------------------------
// logging casos no manejados

app.use('*', (req, res, next) => {
    logWarning(`${req.method} ${req.originalUrl} - ruta inexistente!`)
        next()
})

// logging general
app.use((req, res, next) => {
    logInfo(`${req.method} ${req.url}`)
    next()
})

// Test DTO
import ProductosController from './src/controller/Productos.controller.js'
app.get('/test', async (req, res) => {
    const docs = await ProductosController.listarAllCotizaciones();
    res.json(docs)
})

// Test MOCHA API
import {api} from './src/api/productos.js'
app.use('/apiProductos', api)


//--------------------------------------------
// inicio el servidor

// CLUSTER
export const CPU_CORES = os.cpus().length
if (config.mode == 'CLUSTER' && cluster.isPrimary) {
    const numCPUs = os.cpus().length
    console.log(`Número de procesadores: ${numCPUs}`)
    console.log(`PID MASTER ${process.pid}`)

    for (let i = 0; i < numCPUs; i++) {
        cluster.fork()
    }

    cluster.on('exit', worker => {
        console.log(`Worker finalizó proceso ${process.pid} ${worker.id} ${worker.pid} finalizó el ${new Date().toLocaleString}`)
        cluster.fork()
    })
} else {
    process.on('exit', code => {
        console.log('Salida con código de error: ' + code)
    })

    httpServer.listen(config.PORT, err => {
        if (!err) console.log(`Servidor http escuchando en el puerto ${config.PORT} - PID: ${process.pid}`)
    })
}