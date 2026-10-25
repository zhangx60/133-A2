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
	document.getElementById('numberTweets').innerText = tweet_array.length;	
    if (tweet_array.length === 0) {
        return;
    }
	var earliestTweet = tweet_array[0];//Find the earliest and latest tweets
	var latestTweet = tweet_array[0];//Start by assuming the first tweet is both the earliest and the latest

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

	var completedCount = 0;
	var liveCount = 0;
	var achievementCount = 0;
	var miscCount = 0;

	for (var i = 0; i < tweet_array.length; i++) {
		var source = tweet_array[i].source;

		if (source == "completed_event") {
			completedCount = completedCount + 1;
		} else if (source == "live_event") {
			liveCount = liveCount + 1;
		} else if (source == "achievement") {
			achievementCount = achievementCount + 1;
		} else {
			miscCount = miscCount + 1;
		}
	}

	//calculate the percentages
	var total = tweet_array.length;
	var completedPct = completedCount / total * 100;
	var livePct = liveCount / total * 100;
	var achievementPct = achievementCount / total * 100;
	var miscPct = miscCount / total * 100;

	//Format the percentages with exactly two decimal places
	var pctFormat = {notation: 'fixed', precision: 2};

	//"completedEvents" appears TWICE on the page, so we need querySelectorAll and a loop
	var completedSpans = document.querySelectorAll('.completedEvents');
	for (var i = 0; i < completedSpans.length; i++) {
		completedSpans[i].innerText = completedCount;
	}

	//These spans only appear once
	document.querySelector('.completedEventsPct').innerText = math.format(completedPct, pctFormat) + '%';
	document.querySelector('.liveEvents').innerText = liveCount;
	document.querySelector('.liveEventsPct').innerText = math.format(livePct, pctFormat) + '%';
	document.querySelector('.achievements').innerText = achievementCount;
	document.querySelector('.achievementsPct').innerText = math.format(achievementPct, pctFormat) + '%';
	document.querySelector('.miscellaneous').innerText = miscCount;
	document.querySelector('.miscellaneousPct').innerText = math.format(miscPct, pctFormat) + '%';

	var writtenCount = 0;
	for (var i = 0; i < tweet_array.length; i++) {
		var tweet = tweet_array[i];

		//Only count tweets that are completed events AND have written text
		if (tweet.source == "completed_event" && tweet.written) {
			writtenCount = writtenCount + 1;
		}
	}
	//percentage is out of the completed tweets
	var writtenPct = writtenCount / completedCount * 100;

	document.querySelector('.written').innerText = writtenCount;
	document.querySelector('.writtenPct').innerText = math.format(writtenPct, pctFormat) + '%';
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});