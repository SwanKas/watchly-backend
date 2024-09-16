import mongoose from 'mongoose';
import { Client } from '@elastic/elasticsearch';
import dotenv from 'dotenv';
import Movie from '../models/Movie.js'; // Chemin vers votre modèle de film
import Serie from '../models/Serie.js'; // Chemin vers votre modèle de série

dotenv.config();

// Configurez le client Elasticsearch
const client = new Client({
  node: process.env.ELASTICSEARCH_URL,
  auth: {
    apiKey: process.env.ELASTICSEARCH_API_KEY,
  },
});

// Fonction pour indexer les films
const indexMovies = async () => {
  try {
    // Connectez-vous à MongoDB
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');

    // Récupérez les films depuis MongoDB
    const movies = await Movie.find();

    // Indexez chaque film dans Elasticsearch
    for (const movie of movies) {
      await client.index({
        index: 'movies',
        id: movie.tmdb_id.toString(), // Utilisez l'id du film comme identifiant dans Elasticsearch
        body: {
          title: movie.title,
          release_date: movie.release_date,
          vote_average: movie.vote_average,
          vote_count: movie.vote_count,
          overview: movie.overview,
          runtime: movie.runtime,
          tagline: movie.tagline,
          backdrop_path: movie.backdrop_path,
          poster_path: movie.poster_path,
          genre: movie.genre,
          popularity: movie.popularity,
        },
      });
      console.log(`Indexed movie: ${movie.title}`);
    }

    console.log('All movies have been indexed!');
  } catch (error) {
    console.error('Error indexing movies:', error);
  } finally {
    // Déconnectez-vous de MongoDB
    await mongoose.disconnect();
  }
};

// Fonction pour indexer les séries
const indexSeries = async () => {
  try {
    // Connectez-vous à MongoDB
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');

    // Récupérez les séries depuis MongoDB
    const series = await Serie.find();

    // Indexez chaque série dans Elasticsearch
    for (const serie of series) {
      await client.index({
        index: 'series',
        id: serie.tmdb_id.toString(), // Utilisez l'id de la série comme identifiant dans Elasticsearch
        body: {
          title: serie.title,
          release_date: serie.release_date,
          vote_average: serie.vote_average,
          vote_count: serie.vote_count,
          overview: serie.overview,
          backdrop_path: serie.backdrop_path,
          poster_path: serie.poster_path,
          popularity: serie.popularity,
          genre: serie.genre,
          url_trailer: serie.url_trailer,
          providers_id: serie.providers_id,
        },
      });
      console.log(`Indexed series: ${serie.title}`);
    }

    console.log('All series have been indexed!');
  } catch (error) {
    console.error('Error indexing series:', error);
  } finally {
    // Déconnectez-vous de MongoDB
    await mongoose.disconnect();
  }
};

const indexAll = async (req, res) => {
    try {
        await indexMovies(); // Assurez-vous que indexMovies est une fonction async ou gérez correctement les promesses
        await indexSeries(); // Assurez-vous que indexSeries est une fonction async ou gérez correctement les promesses
        res.status(200).json({ message: "Movies and Series indexed successfully!" });
    } catch (error) {
        console.error('Error indexing movies and series:', error);
        res.status(500).json({ error: 'An error occurred during indexing.' });
    }
};

export const searchMovies = async (req, res) => {
  const { query } = req.body; // Le terme de recherche envoyé par le frontend
  console.log(query);
  alert("test");

  try {
    const result = await client.search({
      index: 'movies', // Assurez-vous que cet index existe
      body: {
        query: {
          multi_match: {
            query: query,
            fields: ['title', 'overview', 'genre'], // Recherchez dans ces champs
          }
        }
      }
    });
    const hits = result.hits.hits.map(hit => hit._source);
    res.status(200).json(hits);
  } catch (error) {
    console.error('Error searching movies:', error);
    res.status(500).json({ error: 'An error occurred during the search.' });
  }
};
export default indexAll;