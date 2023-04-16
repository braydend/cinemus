import { type FC, Fragment } from "react";
import Typography from "@mui/material/Typography";
import styles from "./about.module.css";
import { Divider } from "@mui/material";
import { features } from "../../../content";
import { Inspiration, TmdbInfo, Feature } from "../../atoms";

export const About: FC = () => {
  return (
    <main className={styles.main}>
      <Typography noWrap variant="h2" paddingBottom="0.5rem">
        Features
      </Typography>
      {features.map(({ icon, title, body }) => (
        <Fragment key={title}>
          <Feature title={title} body={body} icon={icon} />
          <Divider sx={{ margin: "1rem 0" }} />
        </Fragment>
      ))}
      <Inspiration />
      <Divider sx={{ margin: "1rem 0" }} />
      <TmdbInfo />
    </main>
  );
};
