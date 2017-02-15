import BaseDAL from "./BaseDAL";
import MovieObject from "../Models/MovieObject";

export default class MovieDAL extends BaseDAL {
    constructor() {
        super();
    }
    
    insertMovies(movies: Array<MovieObject>) {
        let self = this,
            insertValues = "";

        for(var i=0;i<movies.length;i++) {
            let current = movies[i],
                guid = current.guid,
                name = current.name;

            movies[i].guid = self.escape(guid) || 0;
            movies[i].name = self.escape(name);

            insertValues += `(${movies[i].guid}, ${movies[i].name}),`;
        }

        return self.query(`INSERT IGNORE INTO movie (guid, name) VALUES ${insertValues.substr(0, insertValues.length - 1)}`);
    }

    insertNewMovie(guid: string, name: string): Promise {
        let self = this;

        guid = self.escape(guid);
        name = self.escape(name);

        return self.query(`INSERT IGNORE INTO movie (guid, name) VALUES ("${guid}", "${name}")`);
    }

    getAllMovies(): Promise<Array<MovieObject>> {
        let self = this;
        return self.query("SELECT id,guid,name FROM cinema", MovieObject, true);
    }
}