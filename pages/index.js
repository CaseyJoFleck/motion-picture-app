import styles from "../styles/styles.module.scss";
import { Component, CSSProperties, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import cx from "classnames";
import AsyncSelect from "react-select/async";
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

  const [fromDatabases, setFromDatabase] = useState([
    {
      id: uuidv4(),
      value: "TEST 1",
      label: "TEST 1",
      watched: false,
    },
    {
      id: uuidv4(),
      value: "TEST 2",
      label: "TEST 2",
      watched: true,
    },
    {
      id: uuidv4(),
      value: "TEST 3",
      label: "TEST 3",
      watched: false,
    },
    {
      id: uuidv4(),
      value: "TEST 4",
      label: "TEST 4",
      watched: true,
    },
  ]);

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

  const filterMovies = (inputValue) =>
    fromDatabases.filter((fromDatabase) =>
      fromDatabase.label.toLowerCase().includes(inputValue.toLowerCase())
    );

  const loadOptions = (inputValue) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        return resolve(filterMovies(inputValue));
      }, 100);
    });
  };

  const handleInputChange = async (inputValue, { action }) => {
    if (action !== "set-value") {
      setMovie(inputValue);
    }
  };

  return (
    <div className={styles.content}>
      <h1 className={styles.h1}>Fleck Family Movies</h1>
      <div>
        <div>
          <AsyncSelect
            isMulti
            closeMenuOnSelect={false}
            inputValue={movie}
            onInputChange={handleInputChange}
            loadOptions={loadOptions}
            cacheOptions={true}
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
