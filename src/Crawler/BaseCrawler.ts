import * as request from "request";

export default class BaseCrawler {
    baseUrl: string;

    constructor(baseUrl: string) {
        let self = this;
        self.baseUrl = baseUrl;
    }

    crawl(path: string) {
        let self = this;
        return new Promise((resolve, reject) => {
            request(`${self.baseUrl}${path}`, (error, response, body) => {
                if (!error && response.statusCode == 200) {
                    resolve(body);
                } else {
                    reject(error);
                }
            });
        });
    }
}