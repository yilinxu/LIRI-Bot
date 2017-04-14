var twitterKeys = require("./keys.js");
var Twitter = require("twitter");
var client = new Twitter(twitterKeys.twitterKeys);
var spotify = require("spotify");
var request = require("request");
var fs = require("fs");
var data = [];
myTweets = function(){
	client.get('statuses/user_timeline.json',{user_id: 'yilin xu', count:20}, function(error, tweets, response){
		if (!error){
			for (key in tweets){
				var message = tweets[key].text + "\ncreated_at: " + tweets[key].created_at + "\n-----\n"
				console.log(message);
				fs.appendFileSync("log.txt",message);
			}
		}
	})
};
spotifyIt = function(query){
	spotify.search({type:'track', query:query}, function(err,data){
		if(err){
			console.log(err);
			return;
		}
		else{
			var songInfo = data.tracks.items[0];
			var message = "Artist: " + songInfo.artists[0].name + "\nName of the song: " + songInfo.name
							+"\nPreview_url: " + songInfo.preview_url + "\nAlbum: " + songInfo.album.name
							+"\n--------";
			console.log(message);
			fs.appendFileSync("log.txt",message+"\n");			 		
		};
	});
};
movieThis = function(query){
	request("http://www.omdbapi.com/?t="+query,function(err, response, body){
		if(!err && response.statusCode === 200){
			var movieInfo = JSON.parse(body);
			var message = "Title of the movie: " + movieInfo.Title + "\nYear the movie came out: " + movieInfo.Year
					+"\nIMDB Rating of the movie: " + movieInfo.imdbRating + "\nCountry where the movie was produced: "+
					movieInfo.Country + "\nLanguage of the movie: " + movieInfo.Language + "\nPlot of the movie: " +
					movieInfo.Plot + "\nActors in the movie: " + movieInfo.Actors;
			console.log(message);
			fs.appendFileSync("log.txt",message+"\n");
			for (var key in movieInfo.Ratings){
				if (movieInfo.Ratings[key].Source === "Rotten Tomatoes"){
					var rottenRating = "Rotten Tomatoes Rating: " + movieInfo.Ratings[1].Value;
					console.log(rottenRating);
					fs.appendFileSync("log.txt",rottenRating+"\n");
				}
			};
			var rottenURL = "Rotten Tomatoes URL: http://www.rottentomatoes.com";
			console.log(rottenURL);
			fs.appendFileSync("log.txt",rottenURL+"\n--------\n");
		}
	})
}
doWhat_it_says = function(){
	fs.readFile("./random.txt", "utf8", function(err, data){
	if (err){
		console.log(err);
	}else{
		data = data.trim().split(",");
		executeCommand(data[0],data[1]);
		}
	});	
};

executeCommand =  function(type, title){
	switch(type){
	case "my-tweets":
		myTweets();
		break;
	case "spotify-this-song":
		if (title){
			spotifyIt(title);
		}else{
			spotifyIt("The Sign by Ace of Base")
		}
		break;
	case "movie-this":
		if (title){
			movieThis(process.argv[3]);
		}else{
			movieThis("mr.nobody");
		}
		break;
	case "do-what-it-says":
		doWhat_it_says();
		break;
	};
};

executeCommand(process.argv[2], process.argv[3]);
