const  sql = require('mssql');
var  config = require('../DataBase/dbconfig');

const Listar = async () =>{
  let pool = await sql.connect(config);
  let user = await pool
    .request()
    .query("Select * from users ");
    pool.close();
    return user.recordset
    
}

const UsuarioExistCedbyUser = async (cedula, usuario) =>{
    let pool = await sql.connect(config);
    let user = await pool
      .request()
      .input('ced', sql.NVarChar, cedula)
      .input('usuario', sql.NVarChar, usuario)
      .query("Select * from users where cedula = @ced and username not in (@usuario)");

      pool.close();
      if(user.rowsAffected > 0){
        return user.recordset
      }
      return undefined
}


const UsuarioExiste = async (cedula) =>{
    let pool = await sql.connect(config);
    let user = await pool
      .request()
      .query("Select * from Users where cedula = " + cedula);

      pool.close();
      if(user.rowsAffected > 0){
        return user.recordset
      }
      return undefined
}

const UsuarioID = async (id) =>{
  let pool = await sql.connect(config);
  let user = await pool
    .request()
    .input("id", sql.Int, id)
    .query(`select U.id, U.userName, U.Nombres, U.Cedula, R.RollName, U.Estado   from Users as U
              join UserRolesMapping as RM on u.ID = RM.UserID
              join RoleMaster as R on r.ID = Rm.RoleID
          where U.id = @id and estado > 0`);

    pool.close();
    if(user.rowsAffected > 0){
      return user.recordset
    }
    return undefined
}

const UsernameExiste = async (usuario,) =>{
    let pool = await sql.connect(config);
    let user = await pool
      .request()
      .input("Usuario", sql.NVarChar, usuario)
      .query("Select * from Users where UserName = @Usuario ");

      pool.close();
      
      if(user.rowsAffected > 0){
        return user.recordset
      }
      return undefined
}


const SetUserRole = async (id, role) =>{
  let pool = await sql.connect(config);
  let user = await pool
    .request()
    .input("Id", sql.Int, id)
    .input("role", sql.Int, role)
    .query(`INSERT INTO [dbo].[UserRolesMapping]
                ([UserID]
                ,[RoleID])
            VALUES
                (@Id
                ,@role)`);

    pool.close();
    //console.log('insert',user)
    if(user.rowsAffected > 0){
      return user.recordset
    }
   
    return undefined
} 


const CrearUsuario = async (cedula, usuario, pass, nombres) =>{
    let pool = await sql.connect(config);
    let user = await pool
      .request()
      .input("Usuario", sql.NVarChar, usuario)
      .input("Pass", sql.NVarChar, pass)
      .input("Nombres", sql.NVarChar, nombres)
      .input("Ced", sql.NVarChar, cedula)
      .query(`INSERT INTO [dbo].[Users]
                ([UserName]
                ,[UserPassword]
                ,[Nombres]
                ,[Estado]
                ,[Cedula])
            VALUES
                (@Usuario
                ,@Pass
                ,@Nombres
                ,1
                ,@Ced)`);

      pool.close();
      //console.log('insert',user)
      if(user.rowsAffected > 0){
        return user.recordset
      }
     
      return undefined
}

const UsuarioUpdate = async (cedula, usuario, pass, nombres, estado) =>{
  let pool = await sql.connect(config);
  let user = await pool
    .request()
    .input("Usuario", sql.NVarChar, usuario)
    .input("Pass", sql.NVarChar, pass)
    .input("Nombres", sql.NVarChar, nombres)
    .input("Ced", sql.NVarChar, cedula)
    .input("Est", sql.Int, estado)
    .query(`UPDATE [dbo].[Users]
            SET [UserPassword] = @Pass
              ,[Nombres] = @Nombres
              ,[Estado] = @Est
              ,[Cedula] = @Ced
          WHERE UserName = @usuario`);

    pool.close();
    
    if(user.rowsAffected > 0){
      return user.recordset
    }
  
    return undefined
}


const UsuarioDelete = async (usuario, estado) =>{
  let pool = await sql.connect(config);
  let user = await pool
    .request()
    .input("Usuario", sql.NVarChar, usuario)
    .input("Est", sql.Int, estado)
    .query(`UPDATE [dbo].[Users]
            SET [Estado] = @Est
          WHERE UserName = @usuario`);

    pool.close();
    
    if(user.rowsAffected > 0){
      return user.recordset
    }
  
    return undefined
}

module.exports = {
    UsuarioExiste,
    UsernameExiste,
    CrearUsuario,
    UsuarioExistCedbyUser,
    UsuarioID,
    UsuarioUpdate,
    UsuarioDelete,
    SetUserRole,
    Listar
}