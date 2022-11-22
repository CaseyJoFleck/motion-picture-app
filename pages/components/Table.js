import cx from "classnames";
import styles from "../../styles/styles.module.scss";

const Table = ({ existingMovies, handleToggle }) => {
  return (
    <div>
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
  );
};

export default Table;
