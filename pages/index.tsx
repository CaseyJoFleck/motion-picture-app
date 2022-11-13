import styles from "../styles/styles.module.scss";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import cx from "classnames";

const Home = () => {
  const [movie, setMovie] = useState("");
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

  const handleToggle = (id: string) => {
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

  const handleAdd = (event: { key: string }) => {
    if (event.key === "Enter") {
      setExistingMovies([
        { id: uuidv4(), movie_name: movie, watched: false },
        ...existingMovies,
      ]);
      setMovie("");
    }
  };

  return (
    <div className={styles.content}>
      <h1 className={styles.h1}>Fleck Family Movies</h1>
      <div>
        <div>
          <input
            type="text"
            className={styles.input}
            placeholder="Movies, TV Shows, etc."
            value={movie}
            onChange={(e) => setMovie(e.target.value)}
            onKeyDown={handleAdd}
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
