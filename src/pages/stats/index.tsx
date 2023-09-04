import { type NextPage } from "next";
import { Heading } from "../../components/atoms";
import { api } from "../../utils/api";

const StatsPage: NextPage = () => {
  const { data } = api.statsRouter.getMostPopularShow.useQuery();

  return (
    <main>
      <Heading level="1">Stats</Heading>
      <section>
        <Heading level="2">Most popular</Heading>
        <div>
          <Heading level="3">Movie</Heading>
        </div>
        <div>
          <Heading level="3">TV Show</Heading>
        </div>
      </section>
    </main>
  );
};

export default StatsPage;
