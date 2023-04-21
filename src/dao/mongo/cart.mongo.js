const Cart = require('../mongo/models/cart.model')

class CartsMongoDao {
  constructor() {}

  async getAll() {
    try {
      const cart = await Cart.find();
      return cart;
    } catch (error) {
      return error;
    }
  }

	async create(cart) {
		try {
			return await Cart.create(cart)
		} catch (error) {
			return error
		}
	}

	async updateCart(cartId, updatedCartData) {
		try {
			const result = await Cart.updateOne(
				{ _id: cartId },
				{ $set: updatedCartData }
			);
			if (result.modifiedCount === 1) {
				return { success: true, message: 'Carrito actualizado exitosamente.' };
			} else {
				return { success: false, message: 'Carrito no encontrado o no se pudo actualizar.' };
			}
		} catch (error) {
			return { success: false, message: 'Error al actualizar el carrito.', error: error };
		}
	}
	
	async deleteMany(){
		try {
			return await Cart.deleteMany()
		} catch (error) {
			return error
		}
	}

	async findOne(id){
		try {
			const cart =  await Cart.findOne({_id: id})
			return cart
		} catch (error) {
			return error
		}
	}

	async findOnePopulated(id){
		try {
			return await Cart.findOne({_id: id}).populate('products.product')
		} catch (error) {
			return error
		}
	}
}

module.exports = CartsMongoDao;
