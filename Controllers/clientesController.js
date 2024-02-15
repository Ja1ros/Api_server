const { response } = require("express");
const bcryptjs = require("bcryptjs");
const ResponseApi = require("../Models/response");
const {
  CreateClient,
  ListClient,
  UpdateClient,
  existCed,
  existMail,
  ClienteCedExist,
  existMailOtherClient,
  getClient,
  ListClientFact
} = require("../Helpers/AuxDBCliente");

const { SetUserRole } = require("../Helpers/AuxConsultasBD");

const ClienteGet = async (req, res = response) => {
  let responseApi = new ResponseApi();
  try {
    const listar = await ListClient();
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

const ClienteGetFac = async (req, res = response) => {
  let responseApi = new ResponseApi();
  try {
    const listar = await ListClientFact();
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

const ClientePost = async (req, res = response) => {
  let responseApi = new ResponseApi();
  try {
    const { cedula, nombres, apellidos, email, direccion, telefono, pass } =
      req.body;
    const cl = await existCed(cedula);
    if (cl) {
      responseApi.status = 400;
      responseApi.msg = "La cédula ya fue registrado";
      return res.status(400).json(responseApi);
    }
    const clml = await existMail(email);
    if (clml) {
      responseApi.status = 400;
      responseApi.msg = "El Email ya fue registrado";
      return res.status(400).json(responseApi);
    }

    const salt = bcryptjs.genSaltSync();
    let pss = bcryptjs.hashSync(pass, salt);

    const create = await CreateClient(
      cedula,
      nombres,
      apellidos,
      telefono,
      direccion,
      email,
      pss
    );
    if (create < 0) {
      responseApi.status = 500;
      responseApi.msg = "No se pudo guardar Revise";
      return res.status(500).json(responseApi);
    }

    const clientCreate = await existCed(cedula);
    console.log(clientCreate);
    const createRole = await SetUserRole(clientCreate[0].ID, 3);
    responseApi.status = 200;
    responseApi.msg = "Cliente Guardado";

    return res.status(200).json(responseApi);
  } catch (error) {
    responseApi.status = 500;
    responseApi.msg = error;
    return res.status(500).json(responseApi);
  }
};

const ClientPut = async (req, res = response) => {
  let responseApi = new ResponseApi();
  try {
    const {
      id,
      cedula,
      nombres,
      apellidos,
      email,
      direccion,
      telefono,
      estado,
      pass,
    } = req.body;

    const verificarCedUser = await ClienteCedExist(cedula, id);
    if (verificarCedUser) {
      responseApi.status = 400;
      responseApi.msg =
        "La cédula ya se encuentra registrada en el Cliente: " +
        verificarCedUser[0].Nombres;
      return res.status(400).json(responseApi);
    }

    const verfiicarEmail = await existMailOtherClient(cedula, id);
    if (verfiicarEmail) {
      responseApi.status = 400;
      responseApi.msg =
        "El email ya se encuentra registrada en el Cliente: " +
        verificarCedUser[0].Nombres;
      return res.status(400).json(responseApi);
    }

    // get client

    const clienteBD = await getClient(id);
    if (!clienteBD) {
      responseApi.status = 400;
      responseApi.msg = "No se encuentra un cliente con ese ID";
      return res.status(400).json(responseApi);
    }

    let pss;
    if (pass =="") {
      pss = clienteBD[0].Contra;
    } else {
      const salt = bcryptjs.genSaltSync();
      pss = bcryptjs.hashSync(pass, salt);
    }

    console.log('Final',pss)

    const update = await UpdateClient(
      id,
      cedula,
      nombres,
      apellidos,
      telefono,
      direccion,
      estado,
      email,
      pss
    );
    if (update < 0) {
      responseApi.status = 500;
      responseApi.msg = "No se pudo actualizar el cliente";
      return res.status(500).json(responseApi);
    }

    responseApi.status = 200;
    responseApi.msg = "Cliente Update";
    return res.status(200).json(responseApi);
  } catch (error) {
    responseApi.status = 500;
    responseApi.msg = error;
    return res.status(500).json(responseApi);
  }
};

module.exports = {
  ClienteGet,
  ClientePost,
  ClientPut,
  ClienteGetFac
};
