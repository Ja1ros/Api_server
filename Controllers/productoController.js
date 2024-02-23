const { response } = require("express");
const ResponseApi = require("../Models/response");

const {
  Listar,
  ListarPorCategoria,
  CreateProduct,
  UpdateProduct,
  ListarPag,
  BuscarPag,
  getByID,
  ListarFact
  
} = require("../Helpers/auxDBProductos");
const { ClienteGet } = require("./clientesController");

const ProductosGet = async (req, res = response) => {
  let responseApi = new ResponseApi();
  try {
    const listar = await Listar();
    responseApi.status = 200;
    responseApi.msg = "OK";
    responseApi.data = listar;
    return res.status(200).json(responseApi);
  } catch (error) {
    responseApi.status = 500;
    responseApi.msg = error;
    return res.status(500).json(responseApi);
  }
};

const ProductosGetFac = async (req, res = response) => {
  let responseApi = new ResponseApi();
  try {
    const listar = await ListarFact();
    responseApi.status = 200;
    responseApi.msg = "OK";
    responseApi.data = listar;
    return res.status(200).json(responseApi);
  } catch (error) {
    responseApi.status = 500;
    responseApi.msg = error;
    return res.status(500).json(responseApi);
  }
};

const ProductosGetPorCategoria = async (req, res = response) => {
  let responseApi = new ResponseApi();
  try {
    const { categoria } = req.params;

    // Llama a la función que obtiene productos por categoría
    const listar = await ListarPorCategoria(categoria);

    responseApi.status = 200;
    responseApi.msg = "OK";
    responseApi.data = listar;
    return res.status(200).json(responseApi);
  } catch (error) {
    responseApi.status = 500;
    responseApi.msg = error;
    return res.status(500).json(responseApi);
  }
};

const ProductosGetID = async (req, res = response) => {
  let responseApi = new ResponseApi();
  try {
    const { id } = req.params;


    // Llama a la función que obtiene productos por categoría
    const listar = await getByID(id);
    console.log(listar)

    responseApi.status = 200;
    responseApi.msg = "OK";
    responseApi.data = listar;
    return res.status(200).json(listar);
  } catch (error) {
    responseApi.status = 500;
    responseApi.msg = error;
    return res.status(500).json(responseApi);
  }
};

const ProductosGetPag = async (req, res = response) => {
  let responseApi = new ResponseApi();
  try {
    const { pag } = req.params;

    if (pag - 1 < 0) {
      responseApi.status = 400;
      responseApi.msg = "Página debe ser mayor a 0";
      responseApi.data = null;
      return res.status(400).json(responseApi);
    }

    let pagina = pag - 1;
    const listar = await ListarPag(pagina);
    responseApi.status = 200;
    responseApi.msg = "OK";
    responseApi.data = listar;
    return res.status(200).json(responseApi);
  } catch (error) {
    responseApi.status = 500;
    responseApi.msg = error;
    return res.status(500).json(responseApi);
  }
};


const ProductosGetBuscar = async (req, res = response) => {
  let responseApi = new ResponseApi();
  try {
    const { pag } = req.params;

    const { text} = req.body;
console.log(text)
    if (pag - 1 < 0) {
      responseApi.status = 400;
      responseApi.msg = "Página debe ser mayor a 0";
      responseApi.data = null;
      return res.status(400).json(responseApi);
    }

    let pagina = pag - 1;
    const listar = await BuscarPag(pagina, text);
    responseApi.status = 200;
    responseApi.msg = "OK";
    responseApi.data = listar;
    return res.status(200).json(responseApi);
  } catch (error) {
    responseApi.status = 500;
    responseApi.msg = error;
    return res.status(500).json(responseApi);
  }
};

const ProductosPost = async (req, res = response) => {
  let responseApi = new ResponseApi();
  try {
    const { nombre, img, precio, peso, stock, codigo, categoria } = req.body;
    const create = await CreateProduct(nombre, img, precio, peso, stock, codigo, categoria);
    if (create < 0) {
      responseApi.status = 500;
      responseApi.msg = "No se pudo guardar Revise los datos";
      return res.status(500).json(responseApi);
    }
    responseApi.status = 200;
    responseApi.msg = "Producto Guardado";

    return res.status(200).json(responseApi);
  } catch (error) {
    responseApi.status = 500;
    responseApi.msg = error;
    return res.status(500).json(responseApi);
  }
};

/*const ProductosScript = async (req, res = response) => {
  let responseApi = new ResponseApi();
  try {
    var cont = 1;
    for (let index = 1; index <= 1000; index++) {
      cont ++;
      let nombre = "Nombre" + index;
      let imgvar = "https://loremflickr.com/320/240?random=";
      let img = imgvar.concat(cont);
      let peso = Math.round((Math.random() * (20 - 3) + 1) * 100) / 100;
      let precio = costo + 2;
      let stock = 2000;
      let codigo = 2323;
      const create = await CreateProduct(nombre, img, precio, costo, stock, codigo);
      if (create < 0) {
        responseApi.status = 500;
        responseApi.msg = "No se pudo guardar Revise los datos";
        return res.status(500).json(responseApi);
      }
    }

    responseApi.status = 200;
    responseApi.msg = "Producto Guardado";

    return res.status(200).json(responseApi);
  } catch (error) {
    console.log(error);
    responseApi.status = 500;
    responseApi.msg = error;
    return res.status(500).json(responseApi);
  }
};*/

const ProductosPut = async (req, res = response) => {
  let responseApi = new ResponseApi();
  try {
    const { id, nombre, img, precio, peso, stock, estado, codigo, categoria } = req.body;

    
    const create = await UpdateProduct(
      id,
      nombre,
      img,
      precio,
      peso,
      stock,
      estado,
      codigo,
      categoria
    );
    if (create < 0) {
      responseApi.status = 500;
      responseApi.msg = "No se pudo guardar Revise los datos";
      return res.status(500).json(responseApi);
    }
    responseApi.status = 200;
    responseApi.msg = "Producto Update";

    return res.status(200).json(responseApi);
  } catch (error) {
    responseApi.status = 500;
    responseApi.msg = error;
    return res.status(500).json(responseApi);
  }
};

module.exports = {
  ProductosGet,
  ProductosGetPorCategoria,
  ProductosPost,
  ProductosPut,
  //ProductosScript,
  ProductosGetID,
  ProductosGetPag,
  ProductosGetBuscar,
  ProductosGetFac
};
