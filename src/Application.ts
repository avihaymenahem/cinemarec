import CinemaDAL from "./DAL/CinemaDAL";
import CinemaCityCrawler from "./Crawler/CinemaCityCrawler";
import MovieDAL from "./DAL/MovieDAL";
import MovieObject from "./Models/MovieObject";
import MovieTimeObject from "./Models/MovieTimeObject";
import * as moment from "moment";
import MovieTimeDAL from "./DAL/MovieTimeDAL";
import request = require("request");
import cheerio = require("cheerio");
import process = require("process");

export default class Application {
    constructor() {
        let self = this;
        self.insertData();
        //self.updateData();
    }

    updateData() {
        let self = this,
            movieTimesDAL = new MovieTimeDAL();

        movieTimesDAL.getNotUpdatedMovieTimesPresentationCode(50).then((res) => {
            let baseURL = "http://tickets.cinema-city.co.il/webtixsnetrishon/?key=rish&ec=$PrsntCode$";
            for(let x=0;x<res.length;x++) {
                let current = res[x],
                    presentationCode = current.presentation_code,
                    id = current.id,
                    url = baseURL.replace("$PrsntCode$", presentationCode)+ "&cf=1004";

                let options = {
                    jar: true,
                    followRedirect: true,
                    url: url,
                    followAllRedirects: true
                };

                console.log("Start request");
                request(options, (err, resp, html) => {
                    if(!err) {
                        let $ = cheerio.load(html);
                        console.log("Loading url", url);
                        let freeChairs = 0,
                            allChairs = 0;

                        $(".VenueSectionSeatsPanel .seat").map(function(){
                            allChairs++;
                            let currentBackgroundImage = $(this).css("background-image");
                            let seatStatus = parseInt(currentBackgroundImage.substr(currentBackgroundImage.search(/(SeatStatus=[0-2])/), 12).split("=")[1]);
                            if(seatStatus === 1) {
                                freeChairs++;
                            }
                        });

                        console.log(`Total Chairs: ${allChairs}, Free Chairs: ${freeChairs}`);
                        if(allChairs > 0) {
                            let newMovieTimeObject = new MovieTimeObject();
                            newMovieTimeObject.id = id;
                            newMovieTimeObject.chairs_count = allChairs;
                            newMovieTimeObject.chairs_taken = allChairs - freeChairs;

                            movieTimesDAL.updateMovieTime(newMovieTimeObject);
                        }
                    }

                    // if((x+1) === res.length) {
                    //     console.log("Finished Running");
                    //     process.exit(0);
                    // }
                });
            }
        });
    }

    insertData() {
        let cinemaCityCrawler = new CinemaCityCrawler(),
            cinemaDAL = new CinemaDAL(),
            movieTimesDAL = new MovieTimeDAL(),
            movieDAL = new MovieDAL();

        cinemaCityCrawler.getResults().then((res) => {
            console.log("Cinema got results");
            //console.log(res);

            let cinemaName = res["sn"],
                seatsUrl = res["tu"],
                cinemaGuid = res["vt"],
                moviesList = res["fe"];

            cinemaDAL.insertNewCinema(cinemaGuid, cinemaName).then(() => {
                console.log("Insert cinema done");
                let movieObjectList = [],
                    movieTimesObject = [];

                for(let i=0;i<moviesList.length;i++) {
                    let currentMovie = moviesList[i],
                        movieTimes = currentMovie["pr"];

                    movieObjectList.push(new MovieObject(currentMovie["dc"], currentMovie["fn"]));

                    for(let x=0;x<movieTimes.length;x++) {
                        let currentMovieTime = movieTimes[x],
                            currentMovieTimeDate = currentMovieTime["dt"].substr(0,10),
                            currentMovieTimeHour = currentMovieTime["tm"];

                        let dateTimeObject = moment(`${currentMovieTimeDate} ${currentMovieTimeHour}`, "DD/MM/YYYY HH:mm").format("YYYY-MM-DD HH:mm:ss");

                        movieTimesObject.push(new MovieTimeObject(currentMovie["dc"], dateTimeObject, 0, 0, currentMovieTime["pc"]));
                    }
                }

                movieDAL.insertMovies(movieObjectList).then(() => {
                    console.log("Insert movies done");

                    movieTimesDAL.insertMovieTimes(movieTimesObject).then(() => {
                        console.log("Insert movie times done");

                    }, (err) => {
                        console.log("Error in movie times", err);
                    });
                }, (err) => {
                    console.log("Error in movies", err);
                });
            }, (err) => {
                console.log("Error in cinema", err);
            });
        }, (err) => {
            console.log("ERROR:", err);
        });
    }
}