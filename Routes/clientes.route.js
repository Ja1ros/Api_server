const { Router } = require("express");
const { validarJWT, validarJWTClient } = require("../Middlewares/validarJWT");
const { validarCampos } = require("../Middlewares/validarCampos");
const { rolesPermitidos } = require("../Middlewares/validarRol");
const { check } = require("express-validator");
const {
  ClienteGet,
  ClientePost,
  ClientPut,
  //ClientePostScript,
  ClienteGetFac
} = require("../Controllers/clientesController");

const router = Router();

router.get(
  "/",
  validarJWT,
  rolesPermitidos("Admin", "User"),
  ClienteGet
);

router.get(
  "/Fac",
  validarJWT,
  rolesPermitidos("Admin", "User"),
  ClienteGetFac
);

router.post(
  "/mov",
  check("cedula", "Cedula obligatorio").not().isEmpty(),
  check("nombres", "Nombre obligatorio").not().isEmpty(),
  check("apellidos", " Apellidos obligatorio").not().isEmpty(),
  check("direccion", " Direccion obligatorio").not().isEmpty(),
  check("telefono", " Teléfono obligatorio").not().isEmpty(),
  check("email", " Email Debe ser un email").isEmail(),
  check("pass", " Password Obligatorio").not().isEmpty(),
  validarCampos,
  ClientePost
);

router.put(
  "/mov",
  check("id", "Id obligatorio").not().isEmpty(),
  check("cedula", "Cedula obligatorio").not().isEmpty(),
  check("nombres", "Nombre obligatorio").not().isEmpty(),
  check("apellidos", " Apellidos obligatorio").not().isEmpty(),
  check("direccion", " Direccion obligatorio").not().isEmpty(),
  check("telefono", " Teléfono obligatorio").not().isEmpty(),
  check("email", " Email Debe ser correcto").isEmail(),
  check("estado", " Estado obligatorio").not().isEmpty(),
  validarJWTClient,
  rolesPermitidos("Client"),
  validarCampos,
  ClientPut
);

router.post(
  "/",
  check("cedula", "Cedula obligatorio").not().isEmpty(),
  check("nombres", "Nombre obligatorio").not().isEmpty(),
  check("apellidos", " Apellidos obligatorio").not().isEmpty(),
  check("direccion", " Direccion obligatorio").not().isEmpty(),
  check("telefono", " Teléfono obligatorio").not().isEmpty(),
  check("email", " Email Debe ser un email").isEmail(),
  check("pass", " Password Obligatorio").not().isEmpty(),
  validarCampos,
  validarJWT,
  rolesPermitidos("Admin", "User"),
  ClientePost
);


/*router.post(
  //"/ScriptSql",
  //ClientePostScript
);
*/
router.put(
  "/",
  check("id", "Id obligatorio").not().isEmpty(),
  check("cedula", "Cedula obligatorio").not().isEmpty(),
  check("nombres", "Nombre obligatorio").not().isEmpty(),
  check("apellidos", " Apellidos obligatorio").not().isEmpty(),
  check("direccion", " Direccion obligatorio").not().isEmpty(),
  check("telefono", " Teléfono obligatorio").not().isEmpty(),
  check("email", " Email Debe ser correcto").isEmail(),
  check("estado", " Estado obligatorio").not().isEmpty(),
  validarJWT,
  rolesPermitidos("Admin", "User"),
  validarCampos,
  ClientPut,
  
);

module.exports = router;
