import Cotizador from '../classes/Cotizador.class.js';
import ProductoDTO from '../classes/ProductoDTO.class.js';
import ProductosDAO from '../models/daos/Productos.Dao.js';

const PrdDAO = new ProductosDAO();
const cot = new Cotizador();

const ProductosController = {
  async guardar(elemento) {
    return await PrdDAO.guardar(elemento);
  },

  async listarAll() {
    return await PrdDAO.listarAll();
  },

  async listarById(id) {
    return await PrdDAO.listar(id);
  },

  async listarAllCotizaciones() {
    const docs = await PrdDAO.listarAll();
    const docsDto = docs.map((producto) => {
      const cotizaciones = {
        precioDolar: cot.getPrecioSegunMoneda(producto.price, 'USD'),
        precioARS: cot.getPrecioSegunMoneda(producto.price, 'ARS'),
        precioCOL: cot.getPrecioSegunMoneda(producto.price, 'COL'),
      };

      console.log(Object.entries(cotizaciones));

      return new ProductoDTO(producto, cotizaciones);
    });

    return docsDto;
  },
};

export default ProductosController;
