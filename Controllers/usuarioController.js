const { response } = require("express");
const bcryptjs = require("bcryptjs");
const ResponseApi = require("../Models/response");
const {
  UsuarioExiste,
  UsernameExiste,
  CrearUsuario,
  UsuarioExistCedbyUser,
  UsuarioUpdate,
  UsuarioDelete,
  SetUserRole,
  Listar
} = require("../Helpers/AuxConsultasBD");

const usuarioListar = async (req, res = response) => {
  let responseApi = new ResponseApi();
  try {

    const lista = await Listar()

    responseApi.status = 200;
    responseApi.msg = "OK";
    responseApi.data = lista

    return res.status(200).json(responseApi);
  } catch (error) {
    responseApi.status = 500;
    responseApi.msg = error;
    return res.status(500).json(responseApi);
  }
};

const usuarioCreate = async (req, res = response) => {
  let responseApi = new ResponseApi();
  try {
    const { cedula, username, password, nombres } = req.body;
    const existeCedula = await UsuarioExiste(cedula);
    
    if (existeCedula) {
      responseApi.status = 400;
      responseApi.msg = "La cédula ya fue registrado";
      return res.status(400).json(responseApi);
    }
    const verificarUsername = await UsernameExiste(username);
    if (verificarUsername) {
      responseApi.status = 400;
      responseApi.msg = "El usuario ya esta registrado";
      return res.status(400).json(responseApi);
    }
    const salt = bcryptjs.genSaltSync();
    let pss = bcryptjs.hashSync(password, salt);
    const crearUser = await CrearUsuario(cedula, username, pss, nombres);
    if (crearUser) {
      responseApi.status = 400;
      responseApi.msg = "No se pudo guardar";
      return res.status(400).json(responseApi);
    }

    const userCreate = await UsernameExiste(username);

    const createRole = await SetUserRole(userCreate[0].ID, 2);
    responseApi.status = 200;
    responseApi.msg = "Usuario Creado";

    return res.status(200).json(responseApi);
  } catch (error) {
    responseApi.status = 500;
    responseApi.msg = error;
    return res.status(500).json(responseApi);
  }
};

const usuarioUpdate = async (req, res = response) => {
  let responseApi = new ResponseApi();
  try {
    const { cedula, username, password, nombres, estado } = req.body;

    const verificarUsername = await UsernameExiste(username);
    if (!verificarUsername) {
      responseApi.status = 400;
      responseApi.msg = "El usuario no existe";
      return res.status(400).json(responseApi);
    }

   

    // Verificar que la cedula no este en otros registros
    //let usuario = req.UsuarioAutenticado;
    const verificarCedUser = await UsuarioExistCedbyUser(cedula,username);
   
    if (verificarCedUser) {
      responseApi.status = 400;
      responseApi.msg = "La cédula ya se encuentra registrada en el Usuario: " + verificarCedUser[0].UserName;
      return res.status(400).json(responseApi);
    }
    
    let pss;
    if(!password){
      pss = verificarUsername[0].UserPassword
    }else{
      const salt = bcryptjs.genSaltSync();
      pss = bcryptjs.hashSync(password, salt);
    }
   
    //Update User
  
    const crearUser = await UsuarioUpdate(cedula, username, pss, nombres, estado);
    if (crearUser) {
      responseApi.status = 400;
      responseApi.msg = "No se pudo guardar";
      return res.status(400).json(responseApi);
    }

    responseApi.status = 200;
    responseApi.msg = "Usuario Actualizado";
    return res.status(200).json(responseApi);

  } catch (error) {
    return res.status(500).json({
      status: "Bad User",
      msg: error.originalError.info,
    });
  }
};

const usuarioDelete = async (req, res = response) => {
  let responseApi = new ResponseApi();
  try {
    const { username, estado } = req.body;

    const verificarUsername = await UsernameExiste(username);
    if (!verificarUsername) {
      responseApi.status = 400;
      responseApi.msg = "El usuario no existe";
      return res.status(400).json(responseApi);
    }

    const deleteUser = await UsuarioDelete(username, estado);
    if (deleteUser) {
      responseApi.status = 400;
      responseApi.msg = "No se pudo eliminar";
      return res.status(400).json(responseApi);
    }

    responseApi.status = 200;
    responseApi.msg = "Usuario Change Status";
    return res.status(200).json(responseApi);

  } catch (error) {
    return res.status(500).json({
      status: "Bad User",
      msg: error.originalError.info,
    });
  }
};


module.exports = {
  usuarioCreate,
  usuarioUpdate,
  usuarioDelete,
  usuarioListar
};
