import styles from "../styles/styles.module.scss";
import {
  Component,
  CSSProperties,
  useState,
  useEffect,
  useCallback,
} from "react";
import { v4 as uuidv4 } from "uuid";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import Header from "./components/Header.js";
import Table from "./components/Table.js";
import Footer from "./components/Footer.js";
import * as dotenv from "dotenv";
dotenv.config();
import express from "express";

const cors = require("cors");
const knex = require("knex");

const db = knex({
  client: "pg",
  connection: {
    host: process.env.PGSQL_HOST,
    user: process.env.PGSQL_USER,
    password: process.env.PGSQL_PASSWORD,
    database: process.env.PGSQL_DATABASE,
    port: process.env.PGSQL_PORT,
  },
});

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// CORS implemented so that we don't get errors when trying to access the server from a different server location
app.use(cors());

const Home = () => {
  const [existingMovies, setExistingMovies] = useState([]);

  const [searchResults, setSearchResults] = useState([]);

  const [movie, setMovie] = useState("");

  const [streamingServices, setStreamingServices] = useState({});

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      db.select("*")
        .from("motion_picture")
        .then((data) => {
          console.log(data);
          setExistingMovies(res.json(data));
          setIsLoading(false);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    setIsLoading(true);
    loadData();
  }, []);

  const handleLikes = (id) => {
    const _existingMovies = existingMovies.map((existingMovie) => {
      if (existingMovie.id === id) {
        db("motion_picture")
          .where("id", "=", id)
          .update({ family_likes: existingMovie.family_likes + 1 })
          .then(() => {
            console.log("Movie Updated");
            return res.json({ msg: "Movie Updated" });
          })
          .catch((err) => {
            console.log(err);
          });
        return {
          ...existingMovie,
          family_likes: existingMovie.family_likes + 1,
        };
      }
      return existingMovie;
    });
    setExistingMovies(_existingMovies);
  };

  const handleDelete = (id) => {
    db("motion_picture")
      .where("id", "=", id)
      .del()
      .then(() => {
        return res.json({ msg: "Movie Deleted" });
      })
      .catch((err) => {
        console.log(err);
      });

    const _existingMovies = existingMovies.filter(
      (_existingMovie) => _existingMovie.id !== id
    );
    setExistingMovies(_existingMovies);
  };

  const getGenreAndRatings = async (title, year, media_type) => {
    try {
      const options = {
        method: "GET",
        headers: {
          "X-RapidAPI-Key":
            "***REMOVED***",
          "X-RapidAPI-Host": "movie-database-alternative.p.rapidapi.com",
        },
      };

      const url = `https://movie-database-alternative.p.rapidapi.com/?s=${title}&r=json&page=1`;
      const res = await fetch(url, options);
      const data = await res.json();
      const imdbId = data.Search.filter(({ Title }) => Title === title).map(
        (p) => p.imdbID
      )[0];

      if (imdbId === undefined) {
        return undefined;
      }

      const urlMovie = `https://movie-database-alternative.p.rapidapi.com/?r=json&i=${imdbId}`;
      const resMovie = await fetch(urlMovie, options);
      const d = await resMovie.json();

      const movieData = {
        contentRating: d.Rated,
        genre: d.Genre,
        director: d.Director,
        actors: d.Actors,
        runtime: d.Runtime,
        imdbRating: d.imdbRating + "/10",
      };
      return movieData;
    } catch (err) {
      console.log(err);
    }
  };

  const getStreamingServices = async (tmd_id, media_type) => {
    try {
      const url =
        media_type === "movie"
          ? `https://api.themoviedb.org/3/movie/${tmd_id}/watch/providers?api_key=***REMOVED***`
          : `https://api.themoviedb.org/3/tv/${tmd_id}/watch/providers?api_key=***REMOVED***`;
      const res = await fetch(url);
      const data = await res.json();

      var _flatrate = [];
      var _rent = [];
      var _buy = [];

      if (data.results.US.flatrate) {
        _flatrate = data.results.US.flatrate.map(
          ({ provider_name, logo_path }) => {
            return {
              name: provider_name,
              logo_path: `https://image.tmdb.org/t/p/${logo_path}`,
            };
          }
        );
      }

      if (data.results.US.rent) {
        _rent = data.results.US.rent.map(({ provider_name, logo_path }) => {
          return {
            name: provider_name,
            logo_path: `https://image.tmdb.org/t/p/${logo_path}`,
          };
        });
      }

      if (data.results.US.buy) {
        _buy = data.results.US.buy.map(({ provider_name, logo_path }) => {
          return {
            name: provider_name,
            logo_path: `https://image.tmdb.org/t/p/${logo_path}`,
          };
        });
      }

      const _streaming_services = {
        flatrate: [_flatrate],
        rent: [_rent],
        buy: [_buy],
      };

      return _streaming_services;
    } catch (err) {
      console.log(err);
    }
  };

  const handleOnSearch = async (string, results) => {
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/search/multi?api_key=***REMOVED***&language=en-US&page=1&include_adult=false&query=${string}`
      );
      const data = await res.json();
      const updatedOptions = data.results
        .filter(({ media_type }) => media_type !== "person")
        .map((p) => {
          return {
            id: uuidv4(),
            title: p.name === undefined ? p.title : p.name,
            media_type: p.media_type,
            tmd_id: p.id,
            description: p.overview,
            release_date:
              p.release_date !== undefined
                ? p.release_date
                : p.first_air_date !== undefined
                ? p.first_air_date
                : "",
            image: p.poster_path
              ? `https://image.tmdb.org/t/p/w500${p.poster_path}`
              : "",
          };
        });
      setSearchResults(updatedOptions);
    } catch (err) {}
  };

  const handleOnSelect = async (item) => {
    const date =
      item.release_date !== undefined
        ? item.release_date
        : item.first_air_date !== undefined
        ? item.first_air_date
        : "";

    const streamers = await getStreamingServices(item.tmd_id, item.media_type);
    const otherFields = await getGenreAndRatings(
      item.title,
      `${date}`.substring(0, 4),
      item.media_type
    );

    db("motion_picture")
      .insert({
        id: uuidv4(),
        movie_name: item.title,
        tmd_id: item.tmd_id,
        description: item.description,
        release_date: item.release_date,
        family_likes: 0,
        image_url: item.image,
        media_type: item.media_type,
        included: streamers.flatrate[0].map(({ name }) => name).join(", "),
        rent: streamers.rent[0].map(({ name }) => name).join(", "),
        buy: streamers.buy[0].map(({ name }) => name).join(", "),
        content_rating: otherFields ? otherFields.contentRating : "",
        genre: otherFields ? otherFields.genre : "",
        director: otherFields ? otherFields.director : "",
        actors: otherFields ? otherFields.actors : "",
        runtime: otherFields ? otherFields.runtime : "",
        imdbRating: otherFields ? otherFields.imdbRating : "",
      })
      .then(() => {
        console.log("Movie Added");
        return res.json({ msg: "Movie Added" });
      })
      .catch((err) => {
        console.log(err);
      });

    setExistingMovies([
      {
        id: uuidv4(),
        movie_name: item.title,
        tmd_id: item.tmd_id,
        description: item.description,
        release_date: item.release_date,
        family_likes: 0,
        image_url: item.image,
        media_type: item.media_type,
        included: streamers.flatrate[0].map(({ name }) => name).join(", "),
        rent: streamers.rent[0].map(({ name }) => name).join(", "),
        buy: streamers.buy[0].map(({ name }) => name).join(", "),
        content_rating: otherFields ? otherFields.contentRating : "",
        genre: otherFields ? otherFields.genre : "",
        director: otherFields ? otherFields.director : "",
        actors: otherFields ? otherFields.actors : "",
        runtime: otherFields ? otherFields.runtime : "",
        imdbRating: otherFields ? otherFields.imdbRating : "",
      },
      ...existingMovies,
    ]);
  };

  const formatResult = (item) => {
    var date =
      item.release_date !== undefined
        ? `${item.release_date}`.substring(0, 4)
        : item.first_air_date !== undefined
        ? `${item.first_air_date}`.substring(0, 4)
        : "";
    return (
      <div className="result-wrapper">
        <span className="result-span">
          {item.title}&nbsp;({item.media_type})&nbsp;({date})
        </span>
      </div>
    );
  };

  if (isLoading) {
    return <p>Loading....</p>;
  }

  return (
    <>
      <Header />
      <div className={styles.content}>
        <div className={styles.search}>
          <div>
            <ReactSearchAutocomplete
              items={searchResults}
              fuseOptions={{ keys: ["title"] }}
              resultStringKeyName="title"
              onSearch={handleOnSearch}
              onSelect={handleOnSelect}
              inputSearchString={movie}
              styling={{ zIndex: 1 }}
              formatResult={formatResult}
              placeholder={"Search Movies or Shows"}
              autoFocus
            />
          </div>

          <br />

          <Table
            existingMovies={existingMovies}
            handleLikes={handleLikes}
            handleDelete={handleDelete}
          />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Home;
