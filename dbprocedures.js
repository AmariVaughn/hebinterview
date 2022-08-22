var config=require('./dbconfig');
const sql=require('mssql');


function getImages(){

    const sql = require("mssql");
    require("msnodesqlv8");
   try{ 
        let pool =await sql.connect(config);
        let Images=await pool.request().query("Select * FROM Images");
        return Images.recordsets;
    
    }catch(error){

        console.log(error);
    }

    
}