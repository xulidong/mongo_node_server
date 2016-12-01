var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

// Connection URL
var DB_NAME = 'gamedb'
var COL_ACCOUNT = 'account'
var URL = 'mongodb://localhost:27017/' + DB_NAME;


var IsInsert = false
var IsFindAll = false
var IsFind = false
var IsUpdate = false
var IsRemove = false
var IsIndex = true


var insertDocuments = function(db, callback) {
	// Get the documents collection
	var collection = db.collection(COL_ACCOUNT);

	// Insert some documents
	data_arr = [
		{aid : 100000001, name : 'aaa'}, 
		{aid : 100000002, name : 'bbb'}, 
		{aid : 100000003, name : 'ccc'}
	]
	collection.insertMany(data_arr, function(err, result) {
		assert.equal(err, null);
		assert.equal(3, result.result.n);
		assert.equal(3, result.ops.length);
		console.log("Inserted 3 documents into the collection");
		callback(result);
	});
}

var findAllDocuments = function(db, callback) {
	// Get the documents collection
	var collection = db.collection(COL_ACCOUNT);

	// Find some documents
	collection.find({}).toArray(function(err, docs) {
		assert.equal(err, null);
		console.log("Found the following records");
		console.log(docs)
		callback(docs);
	});
}

var findDocuments = function(db, callback) {
	// Get the documents collection
	var collection = db.collection(COL_ACCOUNT);

	// Find some documents
	collection.find({'aid': 100000001}).toArray(function(err, docs) {
		assert.equal(err, null);
		console.log("Found the following records");
		console.log(docs);
		callback(docs);
	});      
}

var updateDocument = function(db, callback) {
	// Get the documents collection
	var collection = db.collection(COL_ACCOUNT);

	// Update document where a is 2, set b equal to 1
	collection.updateOne({ aid : 100000001 }, { $set: { name : 'abc' } }, function(err, result) {
		assert.equal(err, null);
		assert.equal(1, result.result.n);
		console.log("Updated the document");
		callback(result);
	});
}

var removeDocument = function(db, callback) {
	// Get the documents collection
	var collection = db.collection(COL_ACCOUNT);

	// Insert some documents
	collection.deleteOne({ aid : 100000001 }, function(err, result) {
		assert.equal(err, null);
		assert.equal(1, result.result.n);
		console.log("Removed the document");
		callback(result);
	});
}

var indexCollection = function(db, callback) {
	// aid index, 1:ascend, -1:descend
	db.collection(COL_ACCOUNT).createIndex( { aid : 1 }, null, function(err, results) {
		console.log(results);
		callback(results);
	});
};

// Use connect method to connect to the server
MongoClient.connect(URL, function(err, db) {
	assert.equal(null, err);
	console.log("Connected successfully to server");
	if (IsInsert) {
		insertDocuments(db, function(result) {
			db.close();
		});
	} 
	else if (IsFindAll) {
		findAllDocuments(db, function(result){
			db.close();
		})
	}
	else if (IsFind) {
		findDocuments(db, function(result){
			db.close();
		})
	}
	else if (IsUpdate) {
		updateDocument(db, function(result){
			db.close();
		})
	}
	else if (IsRemove) {
		removeDocument(db, function(result){
			db.close();
		})
	} 
	else if (IsIndex) {
		indexCollection(db, function(results){
			db.close();
		})
	} 
	else {
		db.close();		
	}
});


