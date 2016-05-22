function Utility() {};

Utility.shuffleArray = function(array) {
	var currentIndex = array.length, temporaryValue, randomIndex;

	// while there remain elements to shuffle...
	while (0 !== currentIndex) {
		// pick a remaining element
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		// and swap it with the current element
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;
};

Utility.pad = function(num, size) {
	var s = num + "";
	while (s.length < size) s = "0" + s;
	return s;
};