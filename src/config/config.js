import dotenv from 'dotenv'
import minimist from "minimist";

//inicializo variables de entorno
dotenv.config()

//Configuro el parametro de minimist para el tema del puerto del servidor
const argv = minimist(process.argv.slice(2), { 
    alias: { 
        p: 'port',
        m: 'mode',
        a: 'auth'
    }, default: { 
        port:  process.env.PORT || 8080,
        mode: 'FORK',
        auth: 'NO_AUTH',
        NODE_ENV: 'PROD'
    } 
})

const sessionConfig = {
    secret: 'anarchy123',
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
        maxAge: 60000
    }
};

function getSpecs() {
    return {
        env: { description: 'entorno de ejecucion', value: argv.NODE_ENV },
        puerto: { description: 'port', value: argv.port },
        modo: { description: 'mode', value: argv.mode },
        argumentos: { description: 'argumentos de entrada', value: process.argv.slice(2).join(', ') },
        plataforma: { description: 'plataforma', value: process.platform },
        versionNode: { description: 'version de node', value: process.version },
        memoriaReservada: { description: 'memoria total reservada (MB)', value: parseInt(process.memoryUsage().rss / 1024 / 1024) },
        rutaEjecucion: { description: 'path de ejecucion del entorno', value: process.execPath },
        idProceso: { description: 'process id', value: process.pid },
        directorioProyecto: { description: 'path del proyecto', value: process.cwd() },
    }
};


export default {
    getSpecs,
    NODE_ENV: argv.NODE_ENV,
    PORT: argv.port,
    mode: argv.mode,
    auth: argv.auth,
    session: sessionConfig,
    mongoLocal: {
        client: 'mongodb',
        cnxStr: process.env.MONGODB_LOCAL
    },
    mongoRemote: {
        client: 'mongodb',
        cnxStr: process.env.MONGODB_REMOTO,
        options: {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                // useCreateIndex: true,
                // serverSelectionTimeoutMS: 5000,
        }    
    },
    sqlite3: {
        client: 'sqlite3',
        connection: {
            filename: `./DB/ecommerce.sqlite`
        },
        useNullAsDefault: true
    },
    fileSystem: {
        path: process.env.FILESYSTEM
    }
}
