import BaseCrawler from "./BaseCrawler";
import {get} from "lodash";

export default class CinemaCityCrawler extends BaseCrawler {
    constructor() {
        super("http://www.cinema-city.co.il/");
    }

    getResults() {
        let self = this;
        return new Promise((resolve, reject) => {
            self.crawl('presentationsJSON?subSiteId=11402&venueTypeId=1&showExpired=false').then((res) => {
                let bodyShowsObject = get(JSON.parse(res), 'sites[0]', {});
                resolve(bodyShowsObject);
            }, (error) => {
                reject(error);
            });
        });
    }
}