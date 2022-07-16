
//Route for all contact deletion, addition, and CRUD
var express = require('express');
var router = express.Router();
const MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/cmps369';
var request = require('request'); 
var ACCESS_TOKEN = 'pk.eyJ1IjoiYnRoYXBhMyIsImEiOiJja2hqYmtwMjMxd3kwMnF0OW9qbm83eG1iIn0.-cY1kDjXImx1CUySGcGtWA'; 
var latitude,longitude;

//Part 5: Securing the Website
var ensureLoggedIn = function(req, res, next) {
	if ( req.user ) {
		next();
	}
	else {
		res.redirect("/login");
	}
}


//setting up a connection with the database
const startup=async()=>{
    try{
        const connection= await MongoClient.connect(url);
        var db=connection.db('cmps369');
        contacts = await db.collection('colon1');
    }
    catch(ex){
        console.log(ex);
    }
}
startup();

var start = function(req, res, next) {

    res.render('mailer', { });
}


router.get('/',ensureLoggedIn, start); //directing to a mailerpage
router.get('/mailer', start);//directing to a mailer page

 
var geocodeandinsert= (post_data,resp,type)=> { //resp:response object , type: update or insert
      
    var url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/'
            + encodeURIComponent(post_data.Street+','+post_data.City+',') + '.json?access_token='
            + ACCESS_TOKEN + '&limit=1';  // getting latitude and logitude data
  

            //Part 4: CRUD
    request({ url: url, json: true }, function (error, response) { 
        if (error) { 
            console.log('Unable to connect to Geocode API'); 
            resp.redirect('/mailer');
        } else if (response.body.features.length == 0) { 
            console.log("Error finding the location") 
            resp.redirect('/mailer'); // if error finding the locations cordinates make user renter the info.
        } else { 
  
            longitude = response.body.features[0].center[0] ; 
            latitude = response.body.features[0].center[1] ;
           
            if(post_data.checkall==='on'){ 
                    post_data.checkemail='on';
                    post_data.checkmail='on';
                    post_data.checkphone='on';
                }
            if(type=='insert'){ // if user is inserting for the first time
                //console.log("trying to insert");
                contacts.insertOne({Firstname:post_data.Firstname,Lastname:post_data.Lastname,
                Street:post_data.Street, City:post_data.City, State:post_data.State,Zip:post_data.Zip,
                Phone:post_data.Phone,Email:post_data.Email,Prefix:post_data.Prefix, 
                contactbymail: post_data.checkmail, Contactbyphone:post_data.checkphone,  
                Contactbyemail:post_data.checkemail, Latitude:latitude,Longitude:longitude})
                
                resp.render('contactinfo', {"post_data": post_data });//rendering thank you page
            }
            else if (type=='update'){//if user is updating the information
               // console.log(post_data);
                var myquery = { "_id": ObjectID(post_data.mongoID) };
                var newvalues = { $set: {Firstname:post_data.Firstname,Lastname:post_data.Lastname,
                    Street:post_data.Street, City:post_data.City, State:post_data.State,Zip:post_data.Zip,
                    Phone:post_data.Phone,Email:post_data.Email,Prefix:post_data.Prefix, 
                    contactbymail: post_data.checkmail, Contactbyphone:post_data.checkphone,  
                    Contactbyemail:post_data.checkemail, Latitude:latitude,Longitude:longitude}};
                contacts.updateOne(myquery, newvalues, function(err, res) {
                  if (err) throw err;
                  resp.redirect('/contacts');//redirecting to contacts page after updates.
                });
               
            }
           
        } 
    }) 
} 

// handling data posted from the mailer page and inserting to database 
router.post('/mailer', function(req, res) {
   
    const  post_data = req.body;
    const type='insert';
    geocodeandinsert(post_data,res,type);

});

/* GET contacts page. */
router.get('/contacts',ensureLoggedIn, function(req, res, next) {
     contacts.find().toArray(function(err, docs) {
        res.render('contacts', {"data": docs });  //rendering contacts page after getting contacts from database
    });  
});

//deletes information from the database using mongoID
//delete works as a post request with mongoID being sent.

router.post('/delete',ensureLoggedIn, function(req, res, next) { 
    post_data = req.body;

    const deletefunc=async(id)=>{
        var myquery = { "_id": ObjectID(id) };
        await contacts.deleteOne(myquery, function(err, obj) {
          if (err) throw err;
          console.log(obj.result.n + " document(s) deleted");
        });
        res.redirect('/contacts'); //redirecting to contacts page after deleting
    }
    
    deletefunc(post_data.mongoID);
 
});


//getting update page is a post request with mongoID being send of a contact
//gets a object from a database and renders that on update page to autorefill

router.post('/getupdateform',ensureLoggedIn, function(req, res) {
    
    var post_data=req.body;
    
    const updatefunc=async(id)=>{
        var myquery = { "_id": ObjectID(id) };
        await contacts.findOne(myquery, function(err, obj) {//gets the table row information from database
          if (err) throw err;
          res.render('./update',{"object":obj});
        });
       
    }
    updatefunc(post_data.mongoID);
  
});



//Part 2:
//Updating the contacts is again post request
//uses function geocodeandinsert to store the updated values
router.post('/update',ensureLoggedIn, function(req, res) {//update information at the database
    post_data = req.body;
    const type='update';// type: either update or insert to the table
    geocodeandinsert(post_data,res,type); 
});

    
module.exports = router;
