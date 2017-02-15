import * as mysql from "mysql";

export default class BaseDAL {
    private connection: mysql.Connection;

    constructor() {
        let self = this;
        self.initConnection();
    }

    private initConnection() {
        let self = this;
        self.connection = mysql.createConnection(process.env.CLEARDB_DATABASE_URL);
    }

    public escape(value: any) {
        let self = this;
        return self.connection.escape(value);
    }

    public query(query: string, castObject?: Object<any>, isCollection?: boolean) : Promise {
        let self = this;
        return new Promise((resolve, reject) => {
            self.connection.query(query, function (error, results, fields) {
                if (error) reject(error);

                if(castObject && isCollection) {
                    results = <Array<castObject>> results;
                } else if(castObject) {
                    results = <castObject> results;
                }
                //self.endConnection();
                resolve(results);
            });
        });
    }

    private endConnection() {
        let self = this;
        self.connection.end();
    }
}