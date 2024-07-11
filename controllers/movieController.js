import axios from 'axios';
import Movie from '../models/Movie.js';
import Serie from '../models/Serie.js';

const fetchMoviesAndSeries = async (req, res) => {

try {
    const movies = [];
    const series = [];

    // Récupérer les 100 premiers films
    for (let page = 1; page <= 5; page++) {
        const response = await axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=${process.env.TMDB_API_KEY}&language=fr-FR&page=${page}`);
        movies.push(...response.data.results);
      }
     // Récupérer les 100 premières séries
    for (let page = 1; page <= 5; page++) {
        const response = await axios.get(`https://api.themoviedb.org/3/discover/tv?api_key=${process.env.TMDB_API_KEY}&language=fr-FR&page=${page}`);
        series.push(...response.data.results);
  }

    // Récupérer les films
    for (const film of movies) {
    const newMovie = new Movie({
        title: film.title,
        release_date: film.release_date,
        vote_average: film.vote_average,
        vote_count: film.vote_count,
        overview: film.overview,
        runtime: film.runtime,
        tagline: film.tagline,
        backdrop_path: film.backdrop_path,
        poster_path: film.poster_path,
        genre: film.genres,
        budget: film.budget,
        popularity: film.popularity,
        
    });
    await newMovie.save();
    }

    // Récupérer les séries
    for (const serie of series) {
        const newSerie = new Serie({
            title: serie.name,
            release_date: serie.first_air_date,
            vote_average: serie.vote_average,
            vote_count: serie.vote_count,
            overview: serie.overview,
            runtime: serie.episode_run_time,
            backdrop_path: serie.backdrop_path,
            poster_path: serie.poster_path,
            genre: serie.genres,
            popularity: serie.popularity
          });
          await newSerie.save();
    }
    res.send('Film and series fetched and stored successfully.');
  } catch (err) {
    console.error(err);
    res.status(500).send('An error occurred.');
  }
};
export default fetchMoviesAndSeries;




