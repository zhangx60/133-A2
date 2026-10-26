//This variable is outside the functions so that both parseTweets and the search handler can use it
var written_tweets = [];

function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	//TODO: Filter to just the written tweets
	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	//Keep only the tweets that have user-written text
	for (var i = 0; i < tweet_array.length; i++) {
		if (tweet_array[i].written) {
			written_tweets.push(tweet_array[i]);
		}
	}
}
function addEventHandlerForSearch() {
	//TODO: Search the written tweets as text is entered into the search box, and add them to the table
	var searchBox = document.getElementById('textFilter');
	var searchCount = document.getElementById('searchCount');
	var searchText = document.getElementById('searchText');
	var table = document.getElementById('tweetTable');

	//Before anything is typed, show 0 results and an empty search text
	searchCount.innerText = 0;
	searchText.innerText = "";

	//"input" runs every time a character is typed/deleted
	searchBox.addEventListener('input', function() {
		var text = searchBox.value;

		//Clear the old rows from the table
		table.innerHTML = "";

		//Show searched history text
		searchText.innerText = text;

		//If the search box is empty, show 0 and stop here (the table stays empty)
		if (text == "") {
			searchCount.innerText = 0;
			return;
		}

		//toLowerCase makes the search ignore upper/lower case (searching "run" also finds "Run")
		var count = 0;
		var rows = "";
		for (var i = 0; i < written_tweets.length; i++) {
			var tweet = written_tweets[i];

			if (tweet.writtenText.toLowerCase().includes(text.toLowerCase())) {
				count = count + 1;
				rows = rows + tweet.getHTMLTableRow(count);
			}
		}
		//Put all the rows into the table at once then update count
		table.innerHTML = rows;
		searchCount.innerText = count;
	});
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	addEventHandlerForSearch();
	loadSavedRunkeeperTweets().then(parseTweets);
});