CREATE TABLE `movie_time` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `movie_id` varchar(45) NOT NULL,
  `movie_time` datetime DEFAULT NULL,
  `chairs_count` smallint(3) DEFAULT NULL,
  `chairs_taken` smallint(3) DEFAULT NULL,
  `presentation_code` int(11) DEFAULT NULL,
  `is_updated` smallint(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `movie_time` (`movie_id`,`movie_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE movie_time ADD UNIQUE KEY `movie_time` (`movie_id`, `movie_time`);

