const { Router } = require("express");
const router = Router();
const ProductsMongoDao = require("../dao/mongo/products.mongo");
const privateAccess = require("../utils/middlewares/privateAcces");

const Product = new ProductsMongoDao()

router.get("/", privateAccess, async (req, res) => {
  const { orderBy, type, brand, size, page, perPage,  } = req.query;
  const {user} = req.session
  console.log(req.session.user)
  const query={}//Solamente deseo filtrar por esos campos
  if(type) query.type = type
  if(brand) query.brand = brand
  if(size) query.size = size

  const order = orderBy || 'name'

  const limit = perPage || 10
  
  const options = {
    page: page||1,
    sort: {[orderBy]: 1},
    limit
  }

  try {
    const products = await Product.paginate(query, options);
    const productsMapped = products.docs.map(({name, description, unitPrice, type, _id})=>({
      id: _id,
      name,
      description,
      unitPrice,
      type
    }))
    res.render('products.handlebars',{ productsMapped, user });
  } catch (error) {
    console.log(error);
  }
});

router.post("/", async (req, res) => {
  const product = req.body
/*   const { type, brand, size, name, description, img, unitPrice, boxPrice, stock} = req.body;
  const product = { type, brand, size, name, description, img, unitPrice, boxPrice, stock};
 */  try {
    await Product.create(product);
    console.log('Producto añadido correctamente')
    res.status(201).json({ msj: "product added" });
  } catch (error) {
    res.status(500).json({msj: error})
  }
});

router.patch('/:pid', async(req,res)=>{
  const campos = req.body
  const {pid} = req.params
  
  const filter = {_id: pid}
/*   const update = {unitPrice:unitPrice} */

  try {
    await Product.updateProduct(filter, {$set:campos}) 
    console.log('producto actualizado correctamente')
    res.send('Product updated')
  } catch (error) {
    console.log(error)
  }

})

router.delete("/", async (req, res) => {
  await Product.deleteMany();
  res.send("productos eliminados");
});

router.get('/:pid/update', async(req, res)=>{
  const {pid} = req.params
  const data = await Product.findOne(pid)
  res.render('editProd.handlebars', data)
})

router.get('/addProds', async (req, res)=>{
  res.render('addProduct.handlebars')
})
module.exports = router;
