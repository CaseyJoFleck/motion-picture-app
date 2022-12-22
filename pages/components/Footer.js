import Image from "next/image";

const Footer = () => {
  const myLoader = ({ src, width, quality }) => {
    return `${src}`;
  };
  return (
    <>
      <div className="footer">
        <div className="footer-div">
          <div className="footer-content">
            <h3
              style={{
                fontSize: "2em",
              }}
            >
              Credits
            </h3>
            <ul>
              <li>
                <Image
                  unoptimized
                  className="tmd-img"
                  loader={myLoader}
                  src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_long_1-8ba2ac31f354005783fab473602c34c3f4fd207150182061e425d366e4f34596.svg"
                  alt="Picture of TMD logo"
                  width={500}
                  height={500}
                />
                <p>
                  &#8226; Some of the film-related metadata used in Fleck Family
                  Movies, synopses, release dates, streaming services, and
                  poster art is supplied by The Movie Database (TMDb).
                </p>
                <p style={{ fontStyle: "italic" }}>
                  &#8226; Fleck Family Movies uses the TMDb API but is not
                  endorsed or certified by TMDb.
                </p>
              </li>
              <li>
                <Image
                  unoptimized
                  className="rapidapi-img"
                  loader={myLoader}
                  src="https://www.vectorlogo.zone/logos/rapidapi/rapidapi-ar21.svg"
                  alt="Picture of Rapid API logo"
                  width={400}
                  height={400}
                />
                <p>
                  &#8226; Some of the film-related metadata used in Fleck Family
                  Movies, directors, actors, genres and IMDB ratings is supplied
                  by API's provided through Rapid API. The source of data comes
                  from JustWatch and the API is the Movie Database Alternative.
                </p>
                <p style={{ fontStyle: "italic" }}>
                  &#8226; Fleck Family Movies uses the Movie Database
                  Alternative API and JustWatch but is not endorsed or certified
                  by the Movie Database Alternative API or JustWatch.
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;
