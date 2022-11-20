import styles from "../styles/styles.module.scss";
import { Component, CSSProperties, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import cx from "classnames";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import Header from "./Header.js";

const Home = () => {
  const [existingMovies, setExistingMovies] = useState([
    {
      id: uuidv4(),
      movie_name: "Movie 1",
      watched: false,
      tmd_id: uuidv4(),
      description: "description",
    },
    {
      id: uuidv4(),
      movie_name: "Movie 2",
      watched: true,
      tmd_id: uuidv4(),
      description: "description",
    },
    {
      id: uuidv4(),
      movie_name: "Movie 3",
      watched: false,
      tmd_id: uuidv4(),
      description: "description",
    },
    {
      id: uuidv4(),
      movie_name: "Movie 4",
      watched: true,
      tmd_id: uuidv4(),
      description: "description",
    },
  ]);

  const [searchResults, setSearchResults] = useState([]);

  const [movie, setMovie] = useState("");

  const handleToggle = (id) => {
    const _existingMovies = existingMovies.map((existingMovie) => {
      if (existingMovie.id === id) {
        return {
          ...existingMovie,
          watched: !existingMovie.watched,
        };
      }
      return existingMovie;
    });
    setExistingMovies(_existingMovies);
  };

  const handleOnSearch = async (string, results) => {
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/search/multi?api_key=***REMOVED***&language=en-US&page=1&include_adult=false&query=` +
          string
      );
      const data = await res.json();
      const updatedOptions = data.results
        .filter(({ media_type }) => media_type !== "person")
        .map((p) => {
          return {
            id: uuidv4(),
            title: p.name === undefined ? p.title : p.name,
            tmd_id: p.id,
            description: p.overview,
          };
        });
      setSearchResults(updatedOptions);
    } catch (err) {}
  };

  const handleOnSelect = (item) => {
    setExistingMovies([
      {
        id: uuidv4(),
        movie_name: item.title,
        watched: false,
        tmd_id: item.tmd_id,
        description: item.description,
      },
      ...existingMovies,
    ]);
  };

  const formatResult = (item) => {
    return (
      <div className="result-wrapper">
        <span className="result-span">{item.title}</span>
      </div>
    );
  };

  return (
    <>
      <Header />
      <div className={styles.content}>
        {/* <h1 className={styles.h1}>Fleck Family Movies</h1> */}
        <div className={styles.search}>
          <div>
            <ReactSearchAutocomplete
              items={searchResults}
              //  value={movie}
              //onChange={(e) => setMovie(e.target.value)}
              fuseOptions={{ keys: ["title"] }} // Search on both fields
              resultStringKeyName="title" // String to display in the results
              onSearch={handleOnSearch}
              onSelect={handleOnSelect}
              inputSearchString={movie}
              styling={{ zIndex: 1 }}
              formatResult={formatResult}
              placeholder={"Movies, Shows, Actors..."}
              autoFocus
            />
          </div>

          <br />

          <ul>
            {existingMovies
              .filter(({ watched }) => !watched)
              .map(({ id, movie_name, watched }) => (
                <li
                  key={id}
                  onClick={() => handleToggle(id)}
                  className={cx(styles.existingMovie)}
                >
                  {movie_name}
                </li>
              ))}
          </ul>

          <ul>
            {existingMovies
              .filter(({ watched }) => watched)
              .map(({ id, movie_name, watched }) => (
                <li
                  key={id}
                  onClick={() => handleToggle(id)}
                  className={cx(styles.existingMovie, styles.watched)}
                >
                  {movie_name}
                </li>
              ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Home;
