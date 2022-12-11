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
import { resolve } from "path";

const Home = () => {
  const [existingMovies, setExistingMovies] = useState([]);

  const [searchResults, setSearchResults] = useState([]);

  const [movie, setMovie] = useState("");

  const [streamingServices, setStreamingServices] = useState({});

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
            release_date: p.release_date,
            image: p.poster_path
              ? `https://image.tmdb.org/t/p/${p.poster_path}`
              : "",
          };
        });
      setSearchResults(updatedOptions);
    } catch (err) {}
  };

  const handleOnSelect = async (item) => {
    const streamers = await getStreamingServices(item.tmd_id, item.media_type);

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
        streaming_services: streamers,
      },
      ...existingMovies,
    ]);
  };

  const formatResult = (item) => {
    return (
      <div className="result-wrapper">
        <span className="result-span">
          {item.title}&nbsp;({item.media_type})
        </span>
      </div>
    );
  };

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

          <Table existingMovies={existingMovies} />
        </div>
      </div>
    </>
  );
};

export default Home;
