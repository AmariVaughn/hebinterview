import config from './dbconfig.js';
import  sql from 'mssql';


new sql.on('error',error=>{
    console.log(error.message);
});


export function storeimagedata(imageurl,objectlist,confidencelist){

 try{ 
    let connection = new sql.ConnectionPool(config);
    let query = `INSERT INTO DetectedImages(imageurl,objectlist,confidencelist)
            VALUES(?,?,?)`;

    let todo = [imageurl, objectlist,confidencelist];

    // execute the insert statment
    new sql.query(query, todo, (err, results, fields) => {
    if (err) {
        return console.error(err.message);
    }
    // get inserted id
    console.log('Todo Id:' + results.insertId);
    });

    connection.end();
        
    }
    catch(error){

        console.log(error);
    }

    
}


export function getImageById(id){
    
    try{
        
        let connection = new sql.ConnectionPool(config);
    }
    catch(error){

        console.log(error);
    }
  

}

export function getImageByObjects(){
    
    try{
        
        let connection = new sql.ConnectionPool(config);
        console.log(connection.connected);
    }
    catch(error){

        console.log(error);
    }
 

}
