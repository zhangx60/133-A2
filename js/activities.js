function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}
	
	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	//TODO: create a new array or manipulate tweet_array to create a graph of the number of tweets containing each type of activity.
	var activityCounts = {};

	for (var i = 0; i < tweet_array.length; i++) {
		var tweet = tweet_array[i];

		//Only completed tweets have an activity type
		if (tweet.source == "completed_event") {
			var type = tweet.activityType;

			//First time we see this type: start at 1. Otherwise: add 1.
			if (activityCounts[type] == undefined) {
				activityCounts[type] = 1;
			} else {
				activityCounts[type] = activityCounts[type] + 1;
			}
		}
	}
    //Turn the dictionary into an array of objects so we can sort it and graph it
	var activityCountArray = [];
	var activityTypes = Object.keys(activityCounts);

	for (var i = 0; i < activityTypes.length; i++) {
		var type = activityTypes[i];
		activityCountArray.push({activityType: type, count: activityCounts[type]});
	}

	//Sort from the most tweets to the least tweets
	activityCountArray.sort(function(a, b) {
		return b.count - a.count;
	});

	//Put the results into the page
	document.getElementById('numberActivities').innerText = activityCountArray.length;
	document.getElementById('firstMost').innerText = activityCountArray[0].activityType;
	document.getElementById('secondMost').innerText = activityCountArray[1].activityType;
	document.getElementById('thirdMost').innerText = activityCountArray[2].activityType;


	activity_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A graph of the number of Tweets containing each type of activity.",
	  "data": {
	    "values": activityCountArray
	  },
	  //TODO: Add mark and encoding
	   "mark": "bar",
	  "encoding": {
	    "x": {"field": "activityType", "type": "nominal", "sort": "-y", "title": "Activity type"},
	    "y": {"field": "count", "type": "quantitative", "title": "Number of tweets"}
	  }
	};
	vegaEmbed('#activityVis', activity_vis_spec, {actions:false});

	//TODO: create the visualizations which group the three most-tweeted activities by the day of the week.
	//Use those visualizations to answer the questions about which activities tended to be longest and when.
	var firstType = activityCountArray[0].activityType;
	var secondType = activityCountArray[1].activityType;
	var thirdType = activityCountArray[2].activityType;

	var distanceArray = [];

	for (var i = 0; i < tweet_array.length; i++) {
		var tweet = tweet_array[i];

		if (tweet.source == "completed_event") {
			var type = tweet.activityType;

			//Only keep the top three activity types and skip tweets with no distance 
			//(like "Just posted a run in 2:36:27"), so they don't count as 0 miles
			if ((type == firstType || type == secondType || type == thirdType) && tweet.distance > 0) {
				distanceArray.push({
					activityType: type,
					distance: tweet.distance,
					time: tweet.time
				});
			}
		}
	}
	//1: every tweet's distance by day 
	distance_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "Distances of the three most tweeted-about activities by day of the week.",
	  "data": {
	    "values": distanceArray
	  },
	  "mark": "point",
	  "encoding": {
	    "x": {"field": "time", "timeUnit": "day", "type": "ordinal", "title": "time (day)"},
	    "y": {"field": "distance", "type": "quantitative", "title": "distance"},
	    "color": {"field": "activityType", "type": "nominal", "title": "activityType"}
	  }
	};

	//2: y=mean distance for each activity on each day
	distance_vis_aggregated_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "Mean distances of the three most tweeted-about activities by day of the week.",
	  "data": {
	    "values": distanceArray
	  },
	  "mark": "point",
	  "encoding": {
	    "x": {"field": "time", "timeUnit": "day", "type": "ordinal", "title": "time (day)"},
	    "y": {"field": "distance", "aggregate": "mean", "type": "quantitative", "title": "Mean of distance"},
	    "color": {"field": "activityType", "type": "nominal", "title": "activityType"}
	  }
	};
	vegaEmbed('#distanceVis', distance_vis_spec, {actions:false});
	vegaEmbed('#distanceVisAggregated', distance_vis_aggregated_spec, {actions:false});

	//show the first graph and hide the mean graph
	var distanceVis = document.getElementById('distanceVis');
	var distanceVisAggregated = document.getElementById('distanceVisAggregated');
	var button = document.getElementById('aggregate');
	distanceVis.style.display = "block";
	distanceVisAggregated.style.display = "none";

	//When the button is clicked, switch which graph is shown
	button.addEventListener('click', function() {
		if (distanceVisAggregated.style.display == "none") {
			//Show the means graph
			distanceVis.style.display = "none";
			distanceVisAggregated.style.display = "block";
			button.innerText = "Show all activities";
		} else {
			//Show the all-points graph
			distanceVis.style.display = "block";
			distanceVisAggregated.style.display = "none";
			button.innerText = "Show means";
		}
	});
	//aanswers based on the graphs
	document.getElementById('longestActivityType').innerText = "bike";
	document.getElementById('shortestActivityType').innerText = "walk";
	document.getElementById('weekdayOrWeekendLonger').innerText = "weekends";
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});