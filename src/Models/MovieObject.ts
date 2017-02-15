export default class MovieObject {
    id: number;
    guid: number;
    name: string;

    constructor(guid: number, name: string) {
        let self = this;
        self.guid = guid;
        self.name = name;
    }
}