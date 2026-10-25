function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});
	
	//This line modifies the DOM, searching for the tag with the numberTweets ID and updating the text.
	//It works correctly, your task is to update the text of the other tags in the HTML file!
	document.getElementById('numberTweets').innerText = tweet_array.length;	
	//Find the earliest and latest tweets
	//Start by assuming the first tweet is both the earliest and the latest
	var earliestTweet = tweet_array[0];
	var latestTweet = tweet_array[0];

	//Go through every tweet and compare time
	for (var i = 0; i < tweet_array.length; i++) {
		var tweet = tweet_array[i];

		//If this tweet is earlier than the earliest one -> new earliest
		if (tweet.time < earliestTweet.time) {
			earliestTweet = tweet;
		}
		//If this tweet is later than the latest one -> new latest
		if (tweet.time > latestTweet.time) {
			latestTweet = tweet;
		}
	}
	//Format the dates like "Sunday, September 23, 2018"
	var dateOptions = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};
	var firstDateText = earliestTweet.time.toLocaleDateString('en-US', dateOptions);
	var lastDateText = latestTweet.time.toLocaleDateString('en-US', dateOptions);

	//Put the dates into the page
	document.getElementById('firstDate').innerText = firstDateText;
	document.getElementById('lastDate').innerText = lastDateText;
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});