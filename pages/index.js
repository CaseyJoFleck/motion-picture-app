import styles from "../styles/styles.module.scss";
import { Component, CSSProperties, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import cx from "classnames";
import { ReactSearchAutocomplete } from "react-search-autocomplete";

const Home = () => {
  const [existingMovies, setExistingMovies] = useState([
    {
      id: uuidv4(),
      movie_name: "Movie 1",
      watched: false,
    },
    {
      id: uuidv4(),
      movie_name: "Movie 2",
      watched: true,
    },
    {
      id: uuidv4(),
      movie_name: "Movie 3",
      watched: false,
    },
    {
      id: uuidv4(),
      movie_name: "Movie 4",
      watched: true,
    },
  ]);

  const movieItems = [
    {
      id: 0,
      title: "Titanic",
      description: "A movie about love",
    },
    {
      id: 1,
      title: "Dead Poets Society",
      description: "A movie about poetry and the meaning of life",
    },
    {
      id: 2,
      title: "Terminator 2",
      description: "A robot from the future is sent back in time",
    },
    {
      id: 3,
      title: "Alien 2",
      description: "Ripley is back for a new adventure",
    },
  ];

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

  const handleAdd = (event) => {
    if (event.key === "Enter") {
      setExistingMovies([
        { id: uuidv4(), movie_name: movie, watched: false },
        ...existingMovies,
      ]);
    }
  };

  const handleOnSearch = (string, results) => {
    // console.log("Onsearch", string, results);
  };

  const handleOnSelect = (item) => {
    setExistingMovies([
      { id: uuidv4(), movie_name: item.title, watched: false },
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
    <div className={styles.content}>
      <h1 className={styles.h1}>Fleck Family Movies</h1>
      <div>
        <div>
          <ReactSearchAutocomplete
            items={movieItems}
            value={movie}
            //onChange={(e) => setMovie(e.target.value)}
            fuseOptions={{ keys: ["title", "description"] }} // Search on both fields
            resultStringKeyName="title" // String to display in the results
            onSearch={handleOnSearch}
            //onHover={handleOnHover}
            onSelect={handleOnSelect}
            // onFocus={handleOnFocus}
            // onClear={handleOnClear}
            //showItemsOnFocus={true}
            inputSearchString={movie}
            styling={{ zIndex: 1, fontSize: "calc(16px + 0.4vw)" }}
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
  );
};

export default Home;
