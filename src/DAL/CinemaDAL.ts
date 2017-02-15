import BaseDAL from "./BaseDAL";
import CinemaObject from "../Models/CinemaObject";

export default class CinemaDAL extends BaseDAL {
    constructor() {
        super();
    }

    insertNewCinema(guid: string, name: string) {
        let self = this;

        guid = self.escape(guid);
        name = self.escape(name);

        return self.query(`INSERT IGNORE INTO cinema (guid, name) VALUES ("${guid}", "${name}")`);
    }

    getAllCinema(): Promise<Array<CinemaObject>> {
        let self = this;
        return self.query("SELECT id,guid,name FROM cinema", CinemaObject, true);
    }
}