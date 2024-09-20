import Serie from '../models/Serie.js';
import Providers from '../models/Providers.js';
import axios from 'axios';
import * as utils from '../utils/importDataUtils.js'; 

const fetchSeries = async (req, res) => {
  try {
      const series = [];
      const type = "tv";

      console.log('Fetching series from TMDB...');
      console.log('-------------------------------');

      for (let page = 1; page <= 20; page++) {
          const response = await axios.get(`https://api.themoviedb.org/3/discover/tv?api_key=${process.env.TMDB_API_KEY}&language=fr-FR&page=${page}`);
          const filteredSeries = response.data.results.filter(serie =>
              serie.original_language === 'en' || serie.original_language === 'fr'
          );
          series.push(...filteredSeries);
      }

      console.log(`Fetched ${series.length} series.`);
      console.log('-------------------------------');

      await utils.clearTables([Serie, Providers]);
      console.log('Database cleared.');
      console.log('-------------------------------');

      for (const serie of series) {
          try {
              // Si tu veux ignorer une série spécifique
              if (serie.id == 31132) continue;

              console.log(`Processing: ${serie.original_name}`);
              console.log('-------------------------------');

              const url = `https://api.themoviedb.org/3/movie/${serie.id}/watch/providers?api_key=${process.env.TMDB_API_KEY}`;
              const response = await axios.get(url);

              const providersData = {
                  FR: response.data.results["FR"] || null,
                  US: response.data.results["US"] || null,
                  UK: response.data.results["GB"] || null
              };

              const providersForSerie = {
                  FR: providersData.FR ? {
                      types: {
                          flatrate: providersData.FR.flatrate?.map((provider) => [provider.provider_name, "https://media.themoviedb.org/t/p/original"+provider.logo_path]) || [],
                          rent: providersData.FR.rent?.map((provider) => [provider.provider_name, "https://media.themoviedb.org/t/p/original"+provider.logo_path]) || [],
                          buy: providersData.FR.buy?.map((provider) => [provider.provider_name, "https://media.themoviedb.org/t/p/original"+provider.logo_path]) || []
                      }
                  } : null,
                  US: providersData.US ? {
                      types: {
                          flatrate: providersData.US.flatrate?.map((provider) => [provider.provider_name, "https://media.themoviedb.org/t/p/original"+provider.logo_path]) || [],
                          rent: providersData.US.rent?.map((provider) => [provider.provider_name, "https://media.themoviedb.org/t/p/original"+provider.logo_path]) || [],
                          buy: providersData.US.buy?.map((provider) => [provider.provider_name, "https://media.themoviedb.org/t/p/original"+provider.logo_path]) || []
                      }
                  } : null,
                  UK: providersData.UK ? {
                      types: {
                          flatrate: providersData.UK.flatrate?.map((provider) => [provider.provider_name, "https://media.themoviedb.org/t/p/original"+provider.logo_path]) || [],
                          rent: providersData.UK.rent?.map((provider) => [provider.provider_name, "https://media.themoviedb.org/t/p/original"+provider.logo_path]) || [],
                          buy: providersData.UK.buy?.map((provider) => [provider.provider_name, "https://media.themoviedb.org/t/p/original"+provider.logo_path]) || []
                      }
                  } : null
              };

              const url_trailer = await utils.getProductTrailer(serie.id, serie.original_name, type);
              
              if (url_trailer) {
                  console.log(`Trailer found for: "${serie.original_name}"`);
              } else {
                  console.log(`No trailer found for: "${serie.original_name}"`);
              }

              const newSerie = new Serie({
                  tmdb_id: serie.id,
                  title: serie.original_name,
                  release_date: serie.first_air_date,
                  vote_average: serie.vote_average,
                  vote_count: serie.vote_count,
                  overview: serie.overview,
                  backdrop_path: serie.backdrop_path,
                  poster_path: serie.poster_path,
                  popularity: serie.popularity,
                  genre: serie.genre_ids,
                  url_trailer: url_trailer,
                  providers_id: providersForSerie,
              });

              await newSerie.save();
              console.log(`✅ ${serie.original_name} has been imported into the database.`);
              console.log('-------------------------------');
              console.log();  // Ligne vide pour ajouter un espace entre les séries

          } catch (error) {
              console.error(`❌ Error processing series "${serie.original_name}":`, error.message);
              // Passer à la série suivante
              continue;
          }
      }

      res.status(200).json({ message: "Series saved successfully!" });

  } catch (error) {
      console.error('❌ Error fetching series and saving:', error);
      res.status(500).json({ error: 'An error occurred.' });
  }
};

// Fonction pour récupérer toutes les séries depuis la base de données
export const getSeriesFromDB = async (req, res) => {
  try {
    const series = await Serie.find(); // Récupérer toutes les séries
    res.status(200).json(series); // Retourner les séries en JSON
  } catch (error) {
    console.error("Erreur lors de la récupération des séries :", error);
    res.status(500).json({ message: "Erreur lors de la récupération des séries." });
  }
};

// Fonction pour récupérer une série par son tmdb_id
export const getSerieByTmdbId = async (req, res) => {
  try {
    const { id } = req.params; 

    const serie = await Serie.findOne({ tmdb_id: id });  

    if (!serie) {
      return res.status(404).json({ message: "Série non trouvée" });
    }

    res.status(200).json(serie);
  } catch (error) {
    console.error("Erreur lors de la récupération de la série :", error);
    res.status(500).json({ message: "Erreur lors de la récupération de la série." });
  }
};

export default fetchSeries;
