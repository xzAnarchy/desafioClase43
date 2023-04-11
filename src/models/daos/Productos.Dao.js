import { logError, logInfo } from '../../loggers/index.js';
import ContenedorMongoDB from '../containers/ContenedorMongoDB.js';
import ProductosModel from '../ProductosModel.js';

class ProductosDao extends ContenedorMongoDB {
  constructor() {
    super(ProductosModel);
    this.contenedor = ContenedorMongoDB.getInstance();
    this.contenedor.conectarDB();
  }

  async buscarProductosPorPrecio(precio) {
    try {
      const productos = await ProductosModel.find({ price: precio });
      logInfo(productos);
      return productos;
    } catch (error) {
      logError('Error al el producto por el precio', error);
      throw error;
    }
  }
}

export default ProductosDao;
