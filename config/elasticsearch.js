import { Client } from "@elastic/elasticsearch";
import dotenv from "dotenv"; // Assure-toi d'importer dotenv ici
import { MongoClient } from "mongodb";

// Charger les variables d'environnement depuis le fichier .env
dotenv.config();
const mongoClient = new MongoClient(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
console.log("test");
console.log(mongoClient);
// Configurer le client ElasticSearch
const esClient = new Client({
  node: process.env.ELASTICSEARCH_URL, // URL d'ElasticSearch
  auth: {
    apiKey: process.env.ELASTICSEARCH_API_KEY, // Clé API
  },
});

export const testConnection = async () => {
  console.log("Tentative de connexion à ElasticSearch..."); // Log pour voir si la fonction est bien appelée
  try {
    const response = await esClient.info();
    console.log("ElasticSearch connected:", response);
  } catch (error) {
    console.error(
      "Erreur lors de la connexion à ElasticSearch:",
      error.message
    );
  }
};

export const deleteIndex = async (index) => {
  try {
    await esClient.indices.delete({ index });
    console.log(`Index '${index}' deleted successfully`);
  } catch (error) {
    if (error.meta && error.meta.body && error.meta.body.error && error.meta.body.error.type === 'index_not_found_exception') {
      console.log(`Index '${index}' does not exist`);
    } else {
      console.error(`Error deleting index '${index}':`, error);
    }
  }
};

export const createIndex = async (index) => {
  try {
    await esClient.indices.create({ index });
    console.log(`Index '${index}' created successfully`);
  } catch (error) {
    console.error(`Error creating index '${index}':`, error);
  }
};

export const syncMoviesData = async () => {
  try {
    await mongoClient.connect();
    const db = mongoClient.db("Watchly");
    const moviesCollection = db.collection("movies");

    const movies = await moviesCollection.find().toArray();
    console.log("Movies found in MongoDB:", movies.length); // Log pour vérifier les films

    for (const movie of movies) {
      const { _id, tmdb_id, ...movieData } = movie; // Exclure les champs _id et tmdb_id du corps du document
      const result = await esClient.index({
        index: "movies",
        id: tmdb_id.toString(), // Utiliser tmdb_id comme identifiant du document
        body: movieData,
      });
      console.log("Movie indexed:", result); // Log pour chaque film indexé
    }

    console.log("Movies data synchronized successfully");
  } catch (error) {
    console.error("Error synchronizing movies data:", error);
  } finally {
    await mongoClient.close();
  }
};

export const syncSeriesData = async () => {
  try {
    await mongoClient.connect();
    const db = mongoClient.db("Watchly");
    const seriesCollection = db.collection("series");

    const series = await seriesCollection.find().toArray();

    for (const serie of series) {
      const { _id, tmdb_id, ...serieData } = serie;
      await esClient.index({
        index: "series",
        id: tmdb_id.toString(), 
        body: serieData,
      });
    }

    console.log("Series data synchronized successfully");
  } catch (error) {
    console.error("Error synchronizing series data:", error);
  } finally {
    await mongoClient.close();
  }
};

// Fonction pour rechercher des films dans l'index 'movies'
export const searchMovies = async (query) => {
  try {
    const searchResult = await client.search({
      index: "movies",
      q: query,
    });
    return searchResult.hits.hits; // Retourne les résultats trouvés
  } catch (error) {
    console.error("Error searching movies:", error);
    throw error; // Propager l'erreur pour qu'elle soit gérée dans le serveur
  }
};
