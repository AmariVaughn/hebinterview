import express from 'express';
import bodyParser from 'body-parser';
import got from 'got';
import * as fs from 'fs';

//import FormData from 'form-data';


const app=express();
var images = {
    table: []
 };

 // using Imagga keys
const apiKey = 'acc_81ec0d97e6973d8';
const apiSecret = '4a6408eafe3088cfe691476e4e07245f';




//port for server localhost
const PORT =5000;


//server modules
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true}));


//get all image metadata
app.get('/images',getAllImages);


///gets all images and metadata
function getAllImages(req,res){
     
 
    console.log(res.send("Hello World also this will give all image metadata"));

}

function getImageById(req, res){

  const id=req.params.Imageid;
  console.log(`[test]! ${id}`);
  console.log(res.send("Hello World also this is the id to handle! ").statusCode);

}

/*uploads image and saves with detected images*/
function uploadImage(req,res){


  const image=req.body["Image"];

   console.log("This is our image to detect object for: "+image);
   const imageObjectList=getDetectedObjects(image);
    
     
}

// get list of objects in image
function getDetectedObjects(imgurl){
    
   
    var imageJSON;

    //use  Immaga here to get image object list
    //object_list={objects:"cat,dog,goose"};///temp
    const imageUrl = 'https://imagga.com/static/images/tagging/wind-farm-538576_640.jpg';// test image

    const url = 'https://api.imagga.com/v2/tags?image_url=' + encodeURIComponent(imgurl);
    (async () => {
        try {
            const response = await got(url, {username: apiKey, password: apiSecret});
            imageJSON=JSON.parse(response.body);
            //listing tags with confidence and object
          
            imageJSON=imageJSON["result"]["tags"];
            console.log(`${Object.keys(imageJSON).length}`);
            //object_list=imageJSON["result"]["tags"][]
            var tags=imageJSON;
            
            for (const [key, value] of Object.entries(imageJSON)) {
                var object_list=[];
               // console.log(`${key}: ${Object.entries(value)}`);
                const tag=Object.entries(value)[1];
                console.log(Object.values(tag)[1]["en"]);
                object_list.push(Object.values(tag)[1]["en"]);
               // console.log(object_list);
                
                 
            }
           
            return object_list;
            
            
          
        } catch (error) {
            console.log(error.response.body);
        }
    })();
    console.log(got.apiKey);     

}


 /* Gets Image using Object list
 The Images returned contain all object within the list. */
function getImagewithObjects(req,res){

    var url=req.params.Image;
    console.log(`[test]! ${Image}`);
    res.send("Should return the image url");


}





app.get('/images/:Imageid',getImageById);
app.get('/images/:Objects',getImagewithObjects);
app.post('/images/',uploadImage); 






app.listen(PORT, () => console.log(`its alive on: http://localhost:${PORT}`));

