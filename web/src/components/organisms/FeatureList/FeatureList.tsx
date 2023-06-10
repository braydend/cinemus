import { type FC, Fragment } from "react";
import { features } from "../../../content";
import { Card } from "../../molecules";

export const FeatureList: FC = () => {
  return (
    <div className="flex flex-col items-center gap-4 md:grid md:grid-cols-3 md:grid-flow-dense md:auto-rows-auto md:items-stretch">
      {features.map(({ icon, title, body }) => (
        <Fragment key={title}>
          <Card title={title} icon={icon} body={body} />
        </Fragment>
      ))}
    </div>
  );
};
