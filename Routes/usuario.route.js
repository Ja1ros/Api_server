const { Router } = require("express");
const { validarJWT } = require("../Middlewares/validarJWT");
const { validarCampos } = require("../Middlewares/validarCampos");
const { rolesPermitidos } = require("../Middlewares/validarRol");
const { check } = require("express-validator");
const {
  usuarioCreate,
  usuarioUpdate,
  usuarioDelete,
  usuarioListar
} = require("../Controllers/usuarioController");


const router = Router();

router.get(
  "/",
  validarJWT,
  rolesPermitidos("Admin"),
  usuarioListar
);

router.post(
  "/",
  check("cedula", "Cedula obligatorio").not().isEmpty(),
  check("username", "Usuario obligatorio").not().isEmpty(),
  check("password", " password obligatorio").not().isEmpty(),
  check("nombres", " Nombres obligatorio").not().isEmpty(),
  validarCampos,
  usuarioCreate
);
router.put(
  "/",
  check("cedula", "Cedula obligatorio").not().isEmpty(),
  check("username", "Usuario obligatorio").not().isEmpty(),
  
  check("nombres", " Nombres obligatorio").not().isEmpty(),
  check("estado", " Estado obligatorio").not().isEmpty(),
  validarJWT,
  rolesPermitidos("Admin", "User"),
  validarCampos,
  usuarioUpdate
);

router.delete(
  "/",
  check("username", "Usuario obligatorio").not().isEmpty(),
  check("estado", " Estado obligatorio").not().isEmpty(),
  validarJWT,
  rolesPermitidos("Admin"),
  validarCampos,
  usuarioDelete
);

module.exports = router;
