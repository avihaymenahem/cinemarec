export default class MovieTimeObject {
    id: number;
    movie_id: string;
    movie_time: string;
    chairs_count: number;
    chairs_taken: number;
    presentation_code: number;
    is_updated: number;

    constructor(movie_id: string, movie_time: string, chairs_count: number, chairs_taken: number, presentation_code: number) {
        let self = this;
        self.movie_id = movie_id;
        self.movie_time = movie_time;
        self.chairs_count = chairs_count;
        self.chairs_taken = chairs_taken;
        self.presentation_code = presentation_code;
    }
}