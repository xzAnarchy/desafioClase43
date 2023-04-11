import { expect } from 'chai';
import mongoose from 'mongoose';
import {
  actualizarProducto,
  agregarProducto,
  eliminarProducto,
  obtenerProductos,
} from '../src/services/httpClient.js';

const productoId = '4edd40c86762e0fb23224283';

const producto = {
  _id: mongoose.Types.ObjectId(productoId),
  thumbnail: 'url-de-la-imagen',
  title: 'nombre-del-producto',
  description: 'descripcion-del-producto',
  stock: 10,
  price: 100.0,
};

describe('API de productos', () => {
  it('debería obtener todos los productos', async () => {
    const response = await obtenerProductos();
    expect(response.data).to.be.an('array');
    expect(response.status).to.equal(200);
  });

  it('debería crear un nuevo producto', async () => {
    const response = await agregarProducto(producto);
    expect(response.status).to.equal(200);
    expect(response.data).to.be.an('object');
    expect(response.data).to.have.property('id');
  });

  it('debería actualizar un producto existente', async () => {
    const productoActualizado = {
      thumbnail: 'url-de-la-imagen',
      title: 'nombre-del-producto-actualizado',
      price: 50.0,
    };

    const response = await actualizarProducto(productoId, productoActualizado);
    expect(response.status).to.equal(200);
    expect(response.data).to.be.an('object').that.includes(productoActualizado);
  });

  it('debería eliminar un producto existente', async () => {
    const response = await eliminarProducto(productoId);
    expect(response.data).to.be.an('object').that.includes({
      message: 'Producto eliminado correctamente',
    });
  });
});
