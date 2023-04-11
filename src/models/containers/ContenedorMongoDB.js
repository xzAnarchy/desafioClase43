import mongoose from 'mongoose';
import config from '../../config/config.js';
import { logError, logInfo, logWarning } from '../../loggers/index.js';
import { asPOJO, removeField, renameField } from '../../utils/objectUtils.js';

class ContenedorMongoDB{
  //  #url = 'mongodb+srv://mongodb.net/ecommerce';
  //  #conexion = null;
  //  #mongoose = mongoose;
  //  #coleccion = null;

  constructor(modelo) {
    this.conexion = null;
    this.mongoose = mongoose;
    this.coleccion = modelo;
  }

  //Aplico el patron Singleton
  static getInstance() {
    if (!ContenedorMongoDB.instance) {
      ContenedorMongoDB.instance = new ContenedorMongoDB();
    }
    return ContenedorMongoDB.instance;
  }

  //Funciones
  conectarDB() {
    if (!this.conexion) {
      try {
        this.conexion = this.mongoose.connect(config.mongoRemote.cnxStr, config.mongoRemote.options);
        logInfo('Conexión a la base de datos establecida.');
      } catch (error) {
        logError('Error al conectar a la base de datos:', error);
        throw error;
      }
    }
    return this.conexion;
  }

  async desconectarDB() {
    if (this.conexion) {
      try {
        await this.conexion.disconnect();
        logInfo('Conexión a la base de datos cerrada.');
      } catch (error) {
        logError('Error al desconectar la base de datos:', error);
        throw error;
      }
    }else {
      logWarning('No hay conexión a la base de datos.');
    }
  }

  async listar(id) {
    try {
      const docs = await this.coleccion.find({ _id: id }, { __v: 0 });
      if (docs.length == 0) {
        throw new Error('Error al listar por id: no encontrado');
      } else {
        const result = renameField(asPOJO(docs[0]), '_id', 'id');
        return result;
      }
    } catch (error) {
      throw new Error(`Error al listar por id: ${error}`);
    }
  }

  async listarAll() {
    try {
      const docs = await this.coleccion.find({}, { __v: 0 });
      if (docs.length == 0) {
        throw new Error('Error al listar todo: no encontrado');
      } else {
        const result = docs.map((doc) => renameField(asPOJO(doc), '_id', 'id'));
        return result;
      }
    } catch (error) {
      throw new Error(`Error al listar todo: ${error}`);
    }
  }

  async guardar(nuevoElem) {
    try {
      let doc = await this.coleccion.create(nuevoElem);
      doc = asPOJO(doc);
      renameField(doc, '_id', 'id');
      removeField(doc, '__v');
      return doc;
    } catch (error) {
      throw new Error(`Error al guardar: ${error}`);
    }
  }

  async actualizar(id, nuevoElem) {
    try {
      renameField(nuevoElem, 'id', '_id');
      const doc = await this.coleccion.findByIdAndUpdate(id, nuevoElem, {
        new: true,
        runValidators: true,
      });
      if (!doc) {
        throw new Error('Error al actualizar: no encontrado');
      } else {
        const result = asPOJO(doc);
        renameField(result, '_id', 'id');
        removeField(result, '__v');
        return result;
      }
    } catch (error) {
      throw new Error(`Error al actualizar: ${error}`);
    }
  }

  async borrar(id) {
    try {
      const doc = await this.coleccion.findByIdAndDelete(id);
      if (!doc) {
        throw new Error('Error al borrar: no encontrado');
      } else {
        const result = asPOJO(doc);
        renameField(result, '_id', 'id');
        removeField(result, '__v');
        return result;
      }
    } catch (error) {
      throw new Error(`Error al borrar: ${error}`);
    }
  }

  // async conectarDB() {
  // await this.mongodb(this.url)
  // }

  // async buscarUsuarioPorEmail(email) {
  // await this.conectarDB()
  // const usuario = await UsuariosModel.findOne({ email })
  // return usuario
  // }

  // async registrarUsuario(usuario) {
  // await this.conectarDB()
  // const userExist = await UsuariosModel.findOne({ email: usuario.email })
  // if (userExist) return false
  // usuario.password = objectUtils.createHash(usuario.password)
  // const newUser = new UsuariosModel(usuario)
  // await newUser.save()
  // return true
  // }
}

const instance = ContenedorMongoDB.getInstance();
const instance2 = ContenedorMongoDB.getInstance();

console.log(instance === instance2); // true - Singleton

export default ContenedorMongoDB;
