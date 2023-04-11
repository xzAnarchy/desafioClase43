import ContenedorMongoDB from '../containers/ContenedorMongoDB.js';
import UsuariosModel from '../UsuariosModel.js';

class UsuariosDao extends ContenedorMongoDB {
  constructor() {
    super(UsuariosModel);
    this.contenedor = ContenedorMongoDB.getInstance();
    this.contenedor.conectarDB();
  }

  //Si quiero usar una funcion de la clase padre, tengo que utilizarla como promesa y usar .then()

  async buscarUsuarioPorEmail(email) {
    try {
      const usuario = await UsuariosModel.findOne({ email });
      return usuario;
    } catch (error) {
      console.error('Error al buscar usuario por email:', error);
      throw error;
    }
  }

  async registrarUsuario(usuario) {
    try {
      const userExist = await UsuariosModel.findOne({ email: usuario.email });
      if (userExist) return false;
      usuario.password = objectUtils.createHash(usuario.password);
      const newUser = new UsuariosModel(usuario);
      await newUser.save();
      return true;
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      throw error;
    }
  }
}

export default UsuariosDao;
