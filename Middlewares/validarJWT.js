const { request, response } = require("express");
const jwt = require("jsonwebtoken");
const { UsuarioID } = require("../Helpers/AuxConsultasBD");
const { getClient } = require("../Helpers/AuxDBCliente");

const validarJWT = async (req = request, res = response, next) => {
  const token = req.header("x-token");

  if (!token) {
    return res.status(401).json({
      msg: "No existe el token",
    });
  }
  try {
    const { uid } = jwt.verify(token, process.env.secret);

    console.log(uid)
    const usuario = await UsuarioID(uid);

    if (!usuario) {
      return res.status(401).json({
        msg: "Token no valido - Usuario no existe BD",
      });
    }
    let user = usuario[0];

    if (!user.Estado) {
      return res.status(401).json({
        msg: "Token no valido - Usuario no existe",
      });
    }
    req.uid = uid;
    req.UsuarioAutenticado = user; //seteando que usuario le pertenece

    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      msg: "Token no valido",
      msgError: error,
    });
  }
};

const validarJWTClient = async (req = request, res = response, next) => {
  const token = req.header("x-token");

  if (!token) {
    return res.status(401).json({
      msg: "No existe el token",
    });
  }
  try {
    const { uid } = jwt.verify(token, process.env.secret);
    
    const usuario = await getClient(uid);
   
    if (!usuario) {
      return res.status(401).json({
        msg: "Token no valido - Usuario no existe BD",
      });
    }
    let user = usuario[0];

    if (!user.Estado) {
      return res.status(401).json({
        msg: "Token no valido - Usuario no existe",
      });
    }
    req.uid = uid;
    req.UsuarioAutenticado = user;
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      msg: "Token no valido",
      msgError: error,
    });
  }
};

module.exports = {
  validarJWT,
  validarJWTClient,
};
