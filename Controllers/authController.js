const { response } = require("express");
const bcryptjs = require("bcryptjs");
const { GenerarJWT, GenerarJWTClient } = require("../Helpers/jwt");
const { UsernameExiste, UsuarioID } = require("../Helpers/AuxConsultasBD");
const { existMailClient, getClient } = require("../Helpers/AuxDBCliente");
const ResponseApi = require("../Models/response");

const login = async (req, res = response) => {
  try {
    let responseApi = new ResponseApi();
    const { username, password } = req.body;
    const verificarUsername = await UsernameExiste(username);
    if (!verificarUsername) {
      responseApi.status = 400;
      responseApi.msg = "El usuario No existe";
      return res.status(400).json({ ...responseApi });
    }
    let usuario = verificarUsername[0];
    const validarPass = bcryptjs.compareSync(password, usuario.UserPassword);
    if (!validarPass) {
      responseApi.status = 404;
      responseApi.msg = "Usuario / Password incorrectos";
      return res.status(404).json({ ...responseApi });
    }
    usuario.UserPassword = "";

    const token = await GenerarJWT(usuario.ID);
    responseApi.status = 200;
    responseApi.msg = "Ok";

    const u = await UsuarioID(usuario.ID);
    let user = u[0];
    responseApi.data = { user, token }; //si todo ok enviamos todo al servicio
    res.json(responseApi);
  } catch (error) {
    return res.status(500).json({
      status: "Bad",
      msg: error,
    });
  }
};

const loginCliente = async (req, res = response) => {
  try {
    let responseApi = new ResponseApi();
    const { email, password } = req.body;
    const verificarEmail = await existMailClient(email);
    if (!verificarEmail) {
      responseApi.status = 400;
      responseApi.msg = "El email No existe";
      return res.status(400).json(responseApi);
    }
    
    let cliente = verificarEmail[0];
   
    const validarPass = bcryptjs.compareSync(password, cliente.Contra);
    console.log(validarPass)
    if (!validarPass) {
      responseApi.status = 404;
      responseApi.msg = "Usuario / Password incorrectos";
      return res.status(404).json({ ...responseApi });
    }
    cliente.Contra = "";
    

    const token = await GenerarJWTClient(cliente.ID);
    responseApi.status = 200;
    responseApi.msg = "Ok";
    
    const c = await getClient(cliente.ID);
  
    let client = c[0];
    responseApi.data = { client, token };
    res.json(responseApi);
  } catch (error) {
    return res.status(500).json({
      status: "Bad",
      msg: error,
    });
  }
};

module.exports = {
  login,
  loginCliente
};
