const Datastore = require('nedb');
const db = new Datastore({ filename: __dirname + '/../../.data/list.db', autoload: true });

var Word = {};

Word.fetchAll = function(callback) {
	db.find({}, function(err, wordList) {
		callback(wordList);
	});
};

Word.fetchNotMemorized = function(callback) {
	db.find({ memorized: { $ne: true } }, function(err, wordList) {
		callback(wordList);
	});
};

Word.markAsMemorized = function(_id) {
	console.log("memorizedAsMarked(" + _id + ")");

	db.update({ _id: _id }, { $set: { memorized: true } }, {}, function(err, numReplaced) {
		console.log("numReplaced: " + numReplaced);
	});
};


module.exports = Word;
