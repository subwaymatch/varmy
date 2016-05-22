const process = require('process');
const fs = require('fs');
const Datastore = require('nedb');
const db = new Datastore({ filename: __dirname + '/.data/list.db', autoload: true });
const PersistentStorage = require(__dirname + '/js/PersistentStorage');

var storagePath = __dirname + '/data/';
var persistentStorage = new PersistentStorage(storagePath);

var Commands = {};

Commands.fetchWordList = function(listName, callback) {
	persistentStorage.getItem(listName, function(err, listData) {
		if (err) {
			console.log('An error occured retrieving the list of vocabularies');
			console.log(err);
		} else {
			callback(listData['list']);
		}
	});
};

Commands.insertList = function(wordList) {
	Commands.insertWordListAsync(wordList, 0);
};

Commands.insertWordListAsync = function(wordList, index) {
	if (index >= wordList.length) return;

	var word = wordList[index].word;
	var definition = wordList[index].definition;

	db.findOne({
		word: word,
		definition: definition
	}, function(err, doc) {
		if (err) {
			console.log("Error occured while inserting ")
		}

		if (doc) {
			console.log(word + " already exists in database");
			Commands.insertWordListAsync(wordList, index + 1);
		} else {
			// if word:definition set doesn't exist in database yet, save it
			db.insert(wordList[index], function(err, newDoc) {
				Commands.insertWordListAsync(wordList, index + 1);
			});
		}
	});
};




console.log("================================================");
console.log("JSONtoDB Command Line Tool");
console.log("================================================");
// check if no arguments have been passed
if (process.argv.length <= 2) {

	console.log("No file name has been passed");
	console.log("Usage: ");
	console.log("node commands.js your-json-file-name");
	console.log("Example: ");
	console.log("node command.js wordlist");
	console.log("Note there is no .json extension");
}

else {
	var fileNameWithoutExtension = process.argv[2];

	console.log("Filename: " + fileNameWithoutExtension);

	fs.exists(storagePath + fileNameWithoutExtension + ".json", function(exists) {
		if (exists === true) {
			Commands.fetchWordList(fileNameWithoutExtension, Commands.insertList);
			console.log(fileNameWithoutExtension + " found in data directory");
		} else {
			console.log(fileNameWithoutExtension + " doesn't exist");
		}
	});
}


module.exports = Commands;