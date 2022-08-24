import express from 'express';
import bodyParser from 'body-parser';
import got from 'got';
import * as fs from 'fs';
import * as db from './dbprocedures.js'
import { Console } from 'console';



const app=express();
var images = {};
var imageObjectList;

// using Imagga keys
const apiKey = 'acc_81ec0d97e6973d8';
const apiSecret = '4a6408eafe3088cfe691476e4e07245f';




//port for server localhost
const PORT =5000;


//server modules
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true}));





///gets all images and metadata
function getAllImages(req,res){
     
    
    fs.readFile('imagedatafile.json', 'utf8', function readFileCallback(err, data){

        var db_as_json=JSON.parse(data);
        console.log(db_as_json);
        res.send(JSON.stringify(db_as_json));
    });
    
   
}

//full set of image data found with image id
function getImageById(req, res){
   
  const id=req.params.Imageid; 

  fs.readFile('imagedatafile.json', 'utf8', function readFileCallback(err, data){
  
      res.send(JSON.parse(data)[id]);
      

 });
}

/*uploads image and saves with detected images*/
function uploadImage(req,res){


   const image=req.body["Image"];

   console.log("This is our image to detect object for: "+image);
   imageObjectList=  getDetectedObjects(image).then((result) => {  
    
   imageObjectList=result; 
   console.log(res.send(imageObjectList));



});
   
     
}


// get list of objects in image and add image to mock db
async function getDetectedObjects(imgurl){
    var imageJSON;
    var confidence_list=[];
    var object_list=[];

    //use  Immaga here to get image object list
    //object_list={objects:"cat,dog,goose"};///temp
    const imageUrl = 'https://imagga.com/static/images/tagging/wind-farm-538576_640.jpg';// test image

    const url = 'https://api.imagga.com/v2/tags?image_url=' + encodeURIComponent(imgurl);

    // Do something with response data
        try {
            const response = await got(url, {username: apiKey, password: apiSecret});
            const body= response.body;
            
            
            imageJSON=await JSON.parse(response.body);
            //write result to mock db
            updatefile(imgurl,imageJSON);

            imageJSON=imageJSON["result"]["tags"];
            
            var tags=imageJSON;
          
            for (const [key, value] of Object.entries(imageJSON)) {               
              
                const tag=Object.entries(value)[1];
                //get all confidences
                confidence_list.push(Object.entries(value)[0]);
                //get all objects
                object_list.push(Object.values(tag)[1]["en"]);           
                    
            }

        } catch (error) {
            console.log(error.response.body);
        }
    return  [imageJSON,confidence_list,object_list];

}


 /* Gets Image using Object list
 The Images returned contain all object within the list. */
function getImagewithObjects(req,res){

    var objects=req.params.ImageObjects;
    //console.log(`[test]! ${Image}`);
    res.send("Should return the image url");
    
    //image_objects=readfile();

    fs.readFile('imagedatafile.json', 'utf8', function readFileCallback(err, data){
  
        console.log(data);
        
  
   });
    //for all objects in image_objects
    //filter ultil objects are in image_objects then search
    //then 
        /*var flag = true;
        for(i=0; i<arr.length; i++) {
        if(!arr.includes(arr[i])) {
            flag = false;
        }
        }
        if(flag) {
        console.log("yes");
        }*/

    db.getImageByObjects(objects);

}

//use to update data in mock db
function updatefile (url,datatopush){
    
    fs.readFile('imagedatafile.json', 'utf8', function readFileCallback(err, data){
        if (err){
            console.log(err);
        } else {           
     
      var fromfile=JSON.parse(data);
      console.log(JSON.parse(data));
      console.log(url);
      images=fromfile;
      
      //{'id': {'url': [ [Object from imagga] ]}
      images[Object.keys(images).length]={[url]:[datatopush]}; 

      console.log(images);
      images= JSON.stringify(images); //convert it back to json
      fs.writeFile('imagedatafile.json', images, 'utf8',readfile);  /// write it back 
    }});


}

//use to read mock db
function readfile(){
    
    var db_as_json;
    
    fs.readFile('imagedatafile.json', 'utf8', function readFileCallback(err, data){

        db_as_json=JSON.parse(data);
        console.log(db_as_json);
    });
    console.log(db_as_json);
    res.send(db_as_json);
 }




//get all image metadata
app.get('/images',getAllImages);
//get image using id
app.get('/images/getImage/:Imageid',getImageById);

//get image with chosen object params
app.get('/images/getImageO/:Objects',getImagewithObjects);

//post and get objects in image
app.post('/images/detectobjects/',uploadImage); 






app.listen(PORT, () => console.log(`its alive on: http://localhost:${PORT}`));

