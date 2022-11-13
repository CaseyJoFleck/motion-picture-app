import "../styles/globals.css";
import "../styles/tailwind.css";
import type { AppProps } from "next/app";
import styles from "../styles/styles.module.scss";

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <div className={styles.myapp}>
      <Component {...pageProps} />
    </div>
  );
};

export default MyApp;
