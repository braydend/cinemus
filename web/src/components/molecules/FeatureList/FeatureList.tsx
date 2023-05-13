import { type FC, Fragment } from "react";
import { features } from "../../../content";
import { Card } from "../../atoms";
import styles from "./featureList.module.css";

export const FeatureList: FC = () => {
  return (
    <div className={styles.container}>
      {features.map(({ icon, title, body }, index) => (
        <Fragment key={title}>
          <Card
            title={title}
            icon={icon}
            body={body}
            variant={index % 2 === 1 ? "yellow" : "purple"}
          />
        </Fragment>
      ))}
    </div>
  );
};
