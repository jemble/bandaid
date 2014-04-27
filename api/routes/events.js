/*
* Refactor to use MongoClient as per http://mongodb.github.io/node-mongodb-native/driver-articles/mongoclient.html
*/

var mongo = require('mongodb');

var Server = mongo.Server,
	Db = mongo.Db,
	BSON = mongo.BSONPure;

var server = new Server('127.0.0.1',27017,{auto_reconnect:true});
db = new Db('bandaiddb',server);

db.open(function(err,db){
	if(!err){
		console.log("connected to bandaid db");
		db.collection('events',{strict:true},function(err,collection){
			if(err){
				console.log("The events collection does not exist, creating it with sample data");
				populateDB();
			}
		});
	}
});

exports.findAll = function(req,res){
	db.collection('events',function(err,collection){
		collection.find().toArray(function(err,items){
			res.send(items);
		})
	})
}

exports.findById = function(req,res){
	var id = req.params.id;
	db.collection('events',function(err,collection){
		collection.findOne({'_id':new BSON.ObjectID(id)},function(err,item){
			res.send(item);
		});
	});
}

exports.addEvent = function(req,res){
	var event = req.body;
	console.log("adding event " + JSON.stringify(event));
	db.collection('events',function(err,collection){
		collection.insert(event,{safe:true},function(err,result){
			if(err){
				res.send({'error':'an error occurred adding the event'});
			}
			else{
				console.log('success: '+ JSON.stringify(result[0]));
				res.send(result[0]);
			}
		})
	})
}

exports.updateEvent = function(req, res) {
    var id = req.params.id;
    var event = req.body;
    console.log('Updating event: ' + id);
    console.log(JSON.stringify(event));
    db.collection('events', function(err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, event, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating event: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                res.send(event);
            }
        });
    });
}
 
exports.deleteEvent = function(req, res) {
    var id = req.params.id;
    console.log('Deleting event: ' + id);
    db.collection('events', function(err, collection) {
        collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred - ' + err});
            } else {
                console.log('' + result + ' document(s) deleted');
                res.send(req.body);
            }
        });
    });
}

var populateDB = function(){
	var events = [
	{
		name:"Frank's gig",
		location:"Hereford",
		start_date:"Sat Apr 26 2014 19:00:00",
		arrive_time:"14:00:00",
		link:"www.facebook.com",
		confirmed:"confirmed",
		attending:"jem,pete,jed,francis,baker,keith,matt",
		organiser:"Frank"
	}];

	db.collection('events',function(err,collection){
		collection.insert(events,{safe:true},function(err,result){});
	});

}