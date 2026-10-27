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
    //Helper function: get the text between " - " and the link, without the #Runkeeper hashtag
    private extractText():string {
        var startIndex = this.text.indexOf(" - ");
        if (startIndex == -1) {
            return "";
        }
        startIndex = startIndex + 3; //+3 skips over the " - "

        var endIndex = this.text.indexOf("https://t.co");
        //If no link (or the link comes before " - "), take everything until the end of the tweet
        if (endIndex == -1 || endIndex < startIndex) {
            endIndex = this.text.length;
        }

        var result = this.text.substring(startIndex, endIndex);
        result = result.replace("#Runkeeper", ""); //remove the hashtag RunKeeper adds
        return result.trim(); //trim removes extra spaces at the start and end
    }

    //returns a boolean, whether the text includes any content written by the person tweeting.
    get written():boolean {
        //TODO: identify whether the tweet is written
        if (!this.text.includes(" - ")) {
            return false;
        }

        var extracted = this.extractText();

        //Nothing left after removing the link and hashtag: not written
        if (extracted == "") {
            return false;
        }

        //"TomTom MySports Watch" is added automatically by the TomTom watch, not typed by a person
        if (extracted == "TomTom MySports Watch") {
            return false;
        }

        return true;
    }

    get writtenText():string {
        if(!this.written) {
            return "";
        }
        return this.extractText();
    }

    get activityType():string {
        if (this.source != 'completed_event') {
            return "unknown";
        }
        //TODO: parse the activity type from the text of the tweet
        //Split the tweet into words [0]    [1]    [2] [3] [4] [5]
        var words = this.text.split(" ");

        //If word [4] is a unit (km or mi), the activity type is word [5]
        var startWord = 3;
        if (words[4] == "km" || words[4] == "mi") {
            startWord = 5;
        }
        
        //Keep adding words until we reach a word that comes after the activity name
        //This keeps two-word names together, like "mtn bike", "nordic walk", "MySports Freestyle"
        var stopWords = ["with", "-", "workout", "practice", "session", "in"];
        var name = "";

        for (var i = startWord; i < words.length; i++) {
            if (stopWords.includes(words[i])) {
                break;
            }
            if (name == "") {
                name = words[i];
            } else {
                name = name + " " + words[i];
            }
        }

        return name;
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
        //clickable link +find start position
        var words = this.text.split(" ");
        var tweetText = "";

        for (var i = 0; i < words.length; i++) {
            var word = words[i];

            if (word.startsWith("https://")) {
                word = "<a href='" + word + "' target='_blank'>" + word + "</a>";
            }

            if (i == 0) {
                tweetText = word;
            } else {
                tweetText = tweetText + " " + word;
            }
        }

        //Build one table row with3 columns: number, activity type
        var row = "<tr>";
        row = row + "<td>" + rowNumber + "</td>";
        row = row + "<td>" + this.activityType + "</td>";
        row = row + "<td>" + tweetText + "</td>";
        row = row + "</tr>";
        return row;
    }
}