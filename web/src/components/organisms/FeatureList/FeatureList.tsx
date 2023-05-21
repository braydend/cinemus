import { type FC, Fragment } from "react";
import { features } from "../../../content";
import { Card } from "../../molecules";
import styles from "./featureList.module.css";

export const FeatureList: FC = () => {
  return (
    <div className={styles.container}>
      {features.map(({ icon, title, body }) => (
        <Fragment key={title}>
          <Card title={title} icon={icon} body={body} />
        </Fragment>
      ))}
    </div>
  );
};
