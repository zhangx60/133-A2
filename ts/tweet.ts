class Tweet {
	private text:string;
	time:Date;

	constructor(tweet_text:string, tweet_time:string) {
        this.text = tweet_text;
		this.time = new Date(tweet_time);//, "ddd MMM D HH:mm:ss Z YYYY"
	}

	//returns either 'live_event', 'achievement', 'completed_event', or 'miscellaneous'
    get source():string {
        //TODO: identify whether the source is a live event, an achievement, a completed event, or miscellaneous.
        //Completed events start as "Just completed" or "Just posted"
        if (this.text.startsWith("Just completed") || this.text.startsWith("Just posted")) {
            return "completed_event";
        }
        //Live events start with "Watch my"
        if (this.text.startsWith("Watch my")) {
            return "live_event";
        }
        //Achievements start with "Achieved" or "I just set a goal"
        if (this.text.startsWith("Achieved") || this.text.startsWith("I just set a goal")) {
            return "achievement";
        }
        //Else is miscellaneous
        return "miscellaneous";
    }


    //returns a boolean, whether the text includes any content written by the person tweeting.
    get written():boolean {
        //TODO: identify whether the tweet is written
        if (this.text.includes(" - ")) {
            return true;
        }
        return false;
    }

    get writtenText():string {
        if(!this.written) {
            return "";
        }
        //TODO: parse the written text from the tweet
        var startIndex = this.text.indexOf(" - ") + 3; //+3 skips over the " - "
        var endIndex = this.text.indexOf("https://t.co");

        //Ifno link, take everything until the end of the tweet
        if (endIndex == -1) {
            endIndex = this.text.length;
        }
        var result = this.text.substring(startIndex, endIndex);
        return result.trim(); //trim removes extra spaces at the start and end
    }

    get activityType():string {
        if (this.source != 'completed_event') {
            return "unknown";
        }
        //TODO: parse the activity type from the text of the tweet
        //Split the tweet into words [0]    [1]    [2] [3] [4] [5]
        var words = this.text.split(" ");

        //If word [4] is a unit (km or mi), the activity type is word [5]
        if (words[4] == "km" || words[4] == "mi") {
            return words[5];
        }
        return words[3];
      }

    get distance():number {
        if(this.source != 'completed_event') {
            return 0;
        }
        //TODO: prase the distance from the text of the tweet
        //word [3] is the number, word [4] is the unit
        var words = this.text.split(" ");
        var number = parseFloat(words[3]);
        var unit = words[4];
        if (unit == "mi") {
            return number;
        }
        //Kilo to miles (1 mi = 1.609 km)
        if (unit == "km") {
            return number / 1.609;
        }
        return 0;//No distance
    }

    getHTMLTableRow(rowNumber:number):string {
        //TODO: return a table row which summarizes the tweet with a clickable link to the RunKeeper activity
        return "<tr></tr>";
    }
}