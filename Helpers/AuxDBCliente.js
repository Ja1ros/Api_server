const sql = require("mssql");
var config = require("../DataBase/dbconfig");

const ListClient = async () => {
  let pool = await sql.connect(config);
  let user = await pool.request().query("Select * from Cliente");
  pool.close();
  return user.recordset;
};

const ListClientFact = async () => {
  let pool = await sql.connect(config);
  let user = await pool.request().query("Select * from Cliente where estado > 0");
  pool.close();
  return user.recordset;
};

const existCed = async (ced) => {
  let pool = await sql.connect(config);
  let user = await pool
    .request()
    .input("ced", sql.NVarChar, ced)
    .query("Select * from Cliente where cedRuc = @ced ");
  if (user.rowsAffected > 0) {
    return user.recordset;
  }
  return undefined;
};

const ClienteCedExist = async (ced, id) => {
  let pool = await sql.connect(config);
  let user = await pool
    .request()
    .input("ced", sql.NVarChar, ced)
    .input("id", sql.Int, id)
    .query("Select * from Cliente where cedRuc = @ced and id not in (@id)");
  pool.close();
  
  if (user.rowsAffected > 0) {
    return user.recordset;
  }
  return undefined;
};

const existMail = async (correo) => {
  let pool = await sql.connect(config);
  let user = await pool
    .request()
    .input("mail", sql.NVarChar, correo)
    .query("Select * from Cliente where Correo =  @mail");
  if (user.rowsAffected > 0) {
    return user.recordset;
  }
  return undefined;
};

const existMailClient = async (correo) => {
  let pool = await sql.connect(config);
  let user = await pool
    .request()
    .input("mail", sql.NVarChar, correo)
    .query("Select * from Cliente where Correo =  @mail and estado > 0");
  if (user.rowsAffected > 0) {
    return user.recordset;
  }
  return undefined;
};

const getClient = async (id) => {
  let pool = await sql.connect(config);
  let user = await pool
    .request()
    .input("id", sql.Int, id)
    .query(`
    select U.id, U.Correo, U.Nombres, U.Apellidos, U.CedRuc, U.Telefono, U.Direccion, R.RollName, U.Estado, U.Contra  from Cliente as U
              join UserRolesMapping as RM on u.ID = RM.UserID
              join RoleMaster as R on r.ID = Rm.RoleID
          where U.id = @id `);
  if (user.rowsAffected > 0) {
    return user.recordset;
  }
  return undefined;
};

const getClientID = async (id) => {
  let pool = await sql.connect(config);
  let user = await pool
    .request()
    .input("id", sql.Int, id)
    .query(`
    select * FROM CLIENTE
          where id = @id and estado > 0
    
    Select * from Cliente where id =  @id`);
  if (user.rowsAffected > 0) {
    return user.recordset;
  }
  return undefined;
};

const existMailOtherClient = async (correo, id) => {
  let pool = await sql.connect(config);
  let user = await pool
    .request()
    .input("mail", sql.NVarChar, correo)
    .input("id", sql.Int, id)
    .query("Select * from Cliente where Correo =  @mail and id not in (@id)");
  if (user.rowsAffected > 0) {
    return user.recordset;
  }
  return undefined;
};

const CreateClient = async (
  ced,
  nombres,
  apellidos,
  telefono,
  direccion,
  email, pass
) => {
  let pool = await sql.connect(config);
  let user = await pool
    .request()
    .input("ced", sql.NVarChar, ced)
    .input("nombres", sql.NVarChar, nombres)
    .input("apellidos", sql.NVarChar, apellidos)
    .input("telefono", sql.NVarChar, telefono)
    .input("direccion", sql.NVarChar, direccion)
    .input("pass", sql.NVarChar, pass)
    .input("email", sql.NVarChar, email).query(`INSERT INTO [dbo].[Cliente]
            ([CedRuc]
            ,[Nombres]
            ,[Apellidos]
            ,[Telefono]
            ,[Direccion]
            ,[Estado]
            ,[Correo]
            ,[Contra])
        VALUES
            (@ced
            ,@nombres
            ,@apellidos
            ,@telefono
            ,@direccion
            ,1
            ,@email
            ,@pass)`);
  pool.close();
  return user.rowsAffected;
};

const UpdateClient = async (
  id,
  ced,
  nombres,
  apellidos,
  telefono,
  direccion,
  estado,
  email,
  pass
) => {
  let pool = await sql.connect(config);
  let user = await pool
    .request()
    .input("id", sql.Int, id)
    .input("ced", sql.NVarChar, ced)
    .input("nombres", sql.NVarChar, nombres)
    .input("apellidos", sql.NVarChar, apellidos)
    .input("telefono", sql.NVarChar, telefono)
    .input("direccion", sql.NVarChar, direccion)
    .input("estado", sql.Int, estado)
    .input("pass", sql.NVarChar, pass)
    .input("email", sql.NVarChar, email).query(`UPDATE [dbo].[Cliente]
      SET [CedRuc] = @ced
         ,[Nombres] = @nombres
         ,[Apellidos] = @apellidos
         ,[Telefono] = @telefono
         ,[Direccion] = @direccion
         ,[Estado] = @estado
         ,[Correo] = @email
         ,[Contra] = @pass
    WHERE id = @id
      `);
  pool.close();
  return user.rowsAffected;
};

module.exports = {
  ListClient,
  CreateClient,
  UpdateClient,
  existCed,
  existMail,
  ClienteCedExist,
  existMailOtherClient,
  getClient,
  existMailClient,
  getClientID,
  ListClientFact
};
