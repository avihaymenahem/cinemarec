import BaseDAL from "./BaseDAL";
import MovieTimeObject from "../Models/MovieTimeObject";

export default class MovieTimeDAL extends BaseDAL {
    constructor() {
        super();
    }

    insertMovieTimes(movieTimes: Array<MovieTimeObject>) {
        let self = this,
            insertValues = "";

        for(var i=0;i<movieTimes.length;i++) {
            let current = movieTimes[i],
                movieId = current.movie_id,
                movieTime = current.movie_time,
                chairsCount = current.chairs_count,
                presentationCode = current.presentation_code,
                chairsTaken = current.chairs_taken;

            movieTimes[i].movie_id = self.escape(movieId);
            movieTimes[i].movie_time = self.escape(movieTime);
            movieTimes[i].chairs_count = self.escape(chairsCount);
            movieTimes[i].chairs_taken = self.escape(chairsTaken);
            movieTimes[i].presentation_code = self.escape(presentationCode);

            insertValues += `(${movieTimes[i].movie_id}, ${movieTimes[i].movie_time}, ${movieTimes[i].chairs_count}, ${movieTimes[i].chairs_taken}, ${movieTimes[i].presentation_code}),`;
        }

        return self.query(`INSERT IGNORE INTO movie_time (movie_id, movie_time, chairs_count, chairs_taken, presentation_code) VALUES ${insertValues.substr(0, insertValues.length - 1)}`);
    }

    getNotUpdatedMovieTimesPresentationCode(numberOfResults: number): Promise<Array<MovieTimeObject>> {
        let self = this;
        return self.query(`SELECT id,presentation_code FROM movie_time WHERE is_updated IS NULL LIMIT ${numberOfResults}`, MovieTimeObject, true);
    }

    updateMovieTime(movieTimeObject: MovieTimeObject) {
        let self = this;
        let id = self.escape(movieTimeObject.id),
            chairsCount = self.escape(movieTimeObject.chairs_count),
            chairsTaken = self.escape(movieTimeObject.chairs_taken);


        return self.query(`UPDATE movie_time SET is_updated=1, chairs_count=${chairsCount}, chairs_taken=${chairsTaken} WHERE id=${id}`);
    }
}