const Word = require(__dirname + '/../model/Word');

function VocabularyWindow(window, document) {
	'use strict';

	const shell = require('electron').shell;

	var _this = this;

	var ROTATION_INTERVAL = 5000;

	var btnPrevEl;
	var btnNextEl;
	var btnCheckMark;
	var currentCountEl;
	var totalCountEl;
	var wordContainerEl;
	var definitionContainerEl;
	var wordIdInputEl;
	var shuffledWordList;
	var displayIndex;
	var timeoutHandler;

	var storagePath = __dirname + '/../../data/';

	var init = function() {
		btnPrevEl = document.querySelector('#prev');
		btnNextEl = document.querySelector('#next');
		btnCheckMark = document.querySelector('#checkmark');
		currentCountEl = document.querySelector('#current-count');
		totalCountEl = document.querySelector('#total-count');
		wordContainerEl = document.querySelector('#dictionary .word');
		definitionContainerEl = document.querySelector('#dictionary .definition');
		wordIdInputEl = document.getElementById("wordId");
		timeoutHandler = null;

		// fetch word list
		fetchWordList(function(wordList) {
			Utility.shuffleArray(wordList);

			shuffledWordList = wordList;

			displayAndRotate();
		});

		attachEventListeners();
	};

	var attachEventListeners = function() {
		btnPrevEl.addEventListener('click', backBtnClickHandler);
		btnNextEl.addEventListener('click', forwardBtnClickHandler);

		wordContainerEl.addEventListener('click', function(e) {
			e.preventDefault();

			var baseNaverEnDicURL = "http://endic.naver.com/search.nhn?sLn=kr&isOnlyViewEE=N&query=";
			var word = wordContainerEl.innerHTML;

			shell.openExternal(baseNaverEnDicURL + encodeURI(word));
		});

		btnCheckMark.addEventListener('click', checkMarkBtnClickHandler);
	};

	var fetchWordList = function(callback) {
		Word.fetchNotMemorized(callback);
	};

	var backBtnClickHandler = function(e) {
		e.preventDefault();

		if (displayIndex !== 0) {
			displayIndex--;
		} else {
			displayIndex = shuffledWordList.length - 1;
		}

		displayAndRotate();
	};

	var forwardBtnClickHandler = function(e) {
		e.preventDefault();

		displayIndex = (displayIndex + 1) % shuffledWordList.length;

		displayAndRotate();
	};

	var checkMarkBtnClickHandler = function(e) {
		e.preventDefault();

		var _id = wordIdInputEl.value;

		Word.markAsMemorized(_id);
		removeByIndex(displayIndex);
	};

	var displayAndRotate = function() {
		// initialize index to 0 in case it is not passed
		if (!displayIndex) displayIndex = 0;

		updateVocabulary(shuffledWordList[displayIndex].word, shuffledWordList[displayIndex].definition, shuffledWordList[displayIndex]._id);
		updateIndex(displayIndex + 1, shuffledWordList.length);

		// Clear rotation timer in case it is already running
		if (timeoutHandler) clearInterval(timeoutHandler);

		timeoutHandler = setTimeout(function() {
			displayIndex = (displayIndex + 1) % shuffledWordList.length;

			displayAndRotate();
		}, ROTATION_INTERVAL);
	};

	var updateVocabulary = function(word, definition, _id) {
		wordContainerEl.innerHTML = word;
		definitionContainerEl.innerHTML = definition;
		wordIdInputEl.value = _id;
	};

	var updateIndex = function(currentCount, totalCount) {
		currentCountEl.innerHTML = currentCount;
		totalCountEl.innerHTML = totalCount;
	};

	var removeByIndex = function(index) {
		shuffledWordList.splice(index, 1);

		// Adjust index
		displayIndex = (displayIndex >= shuffledWordList.length) ? (shuffledWordList.length - 1) : displayIndex;

		displayAndRotate();
	};

	init();
}

module.exports = VocabularyWindow;