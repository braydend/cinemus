import { type FC } from "react";
import styles from "./home.module.css";
import { FeatureList } from "../../molecules";
import textLogo from "../../../assets/textLogo.png";

export const Home: FC = () => {
  return (
    <main className={styles.main}>
      <img src={textLogo} alt="Cinemus" className={styles.textLogo} />
      <h2 className={styles.tagline}>Showtime Simplified</h2>
      <div className={styles.features}>
        <FeatureList />
      </div>
    </main>
  );
};
