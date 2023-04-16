import { type FC, Fragment } from "react";
import { features } from "../../../content";
import { Feature } from "../../atoms";
import { Card, CardContent } from "@mui/material";
import styles from "./featureList.module.css";

export const FeatureList: FC = () => {
  return (
    <div className={styles.container}>
      {features.map(({ icon, title, body }) => (
        <Fragment key={title}>
          <span className={styles.icon}>{icon}</span>
          <Card variant="outlined" className={styles.description}>
            <CardContent>
              <Feature title={title} body={body} />
            </CardContent>
          </Card>
        </Fragment>
      ))}
    </div>
  );
};
