const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

const dbPath = path.join(__dirname, "moviesData.db");
const app = express();
app.use(express.json());
let db = null;

const initializeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Ruuning HTTP Server 3000");
    });
  } catch (e) {
    console.log(`Message Error From DB: ${e.message}`);
    process.exit(1);
  }
};
initializeDbAndServer();

//GET ALL MOVIES API
app.get("/movies/", async (request, response) => {
  const getMoviesQuery = `SELECT * FROM movie;`;
  const moviesArray = await db.all(getMoviesQuery);
  response.send(moviesArray);
});

//GET MOVIE API
app.get("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const getMovieQuery = `SELECT * FROM movie
   WHERE movie_id = ${movieId};`;
  const movie = await db.get(getMovieQuery);
  response.send(movie);
});

//CREATE MOVIE API

app.post("/movies/", async (request, response) => {
  const movieDetails = request.body;
  const { directorId, movieName, leadActor } = movieDetails;
  const movieQuery = `INSERT INTO movie(
        director_id,movie_name,lead_actor)
        VAlUES (${movieId},${directorID},${movieName},${leadActor});`;
  const movie = await db.run(movieQuery);
  const movieId = dbResponse.lastID;
  response.send("Successfully Movie Added");
});

//DELETE MOVIE API

app.delete("/movies/:movieId", async (request, response) => {
  const { movieId } = request.params;
  const deleteMovieQuery = `DELETE FROM movie
        WHERE movie_id = ${movieId};`;
  await db.run(deleteMovieQuery);
  response.send("Movie Removed");
});

//GET ALL DIRECTORS

app.get("/directors/", async (request, response) => {
  const getDirectorsQuery = `SELECT * FROM director;`;
  const directorsArray = await db.all(getDirectorsQuery);
  response.send(directorsArray);
});

//GET DIRECTOR

app.get("/directors/:directorId/movies", async (request, response) => {
  const { directorId } = request.params;
  const getDirectorMovies = `SELECT * 
    FROM movie WHERE director_id = ${directorId};`;
  const moviesArray = await db.all(getDirectorMovies);
  response.send(moviesArray);
});

module.exports = app;
