'use strict';

/*
 A very thin wrapper around file IO to store/retrieve JSON for persistence
 */
function PersistentStorage(dataStoragePath) {
	var _this = this;

	const fs = require('fs');
	var dataPath;

	var init = function() {
		dataPath = dataStoragePath;
	};

	_this.getItem = function(key, callback) {
		var fileToRead = dataPath + key + ".json";

		fs.exists(fileToRead, function(exists) {
			if (exists === true) {
				fs.readFile(fileToRead, 'utf8', (err, data) => {
					if (err) {
						console.log("error readFile");
						console.log(err);
						return;
					}

					try {
						data = JSON.parse(data);

						callback(null, data);
					} catch (e) {
						console.log("Error reading from persistent storage file");
						console.log(e);

						callback(err, null);

					}
				});
			} else {
				callback({"message": "File doesn't exist"}, null);
			}
		});
	};

	_this.setItem = function(key, value) {
		var _this = this;
		var fileToWrite = GLOBAL.__app.dataPath + key + ".json";

		if (typeof value === "object" && !Array.isArray(value)) {
			if (_this.isCyclic(value)) {
				throw "Object to store cannot be cyclic";
			}

			// if safe to stringify, go ahead and stringify data
			value = JSON.stringify(value);

			// Save to file
			fs.writeFile(fileToWrite, value, function(err) {
			});
		} else {
			throw "Value must be of an object type";
		}
	};

	// check whether the object is cyclic
	// if object is cyclic, TypeError will be thrown while
	// stringify-ing the object we're trying to save into JSON

	// References
	// http://stackoverflow.com/questions/14962018/detecting-and-fixing-circular-references-in-javascript
	// http://blog.vjeux.com/2011/javascript/cyclic-object-detection.html
	_this.isCyclic = function(objc) {
		var seenObjects = [];

		function detect (obj) {
			if (obj && typeof obj === 'object') {
				if (seenObjects.indexOf(obj) !== -1) {
					return true;
				}
				seenObjects.push(obj);
				for (var key in obj) {
					if (obj.hasOwnProperty(key) && detect(obj[key])) {
						console.log(obj, 'cycle at ' + key);
						return true;
					}
				}
			}
			return false;
		}

		return detect(obj);
	};

	init();
}

module.exports = PersistentStorage;