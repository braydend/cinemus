import { describe, expect, it, vi } from "vitest";
import { render, type RenderResult, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ComponentProps } from "react";
import userEvent from "@testing-library/user-event";
import { MediaSearch } from "./MediaSearch";
import * as searchQueries from "../../../queries/search";
import { sleep } from "../../../../test/sleep";

type Props = ComponentProps<typeof MediaSearch>;

vi.mock("../../../hooks/useAuth", () => ({
  useAuth: () => ({
    jwt: "mock-token",
  }),
}));
describe("<MediaSearch />", () => {
  const setup = (customProps?: Partial<Props>): RenderResult => {
    const queryClient = new QueryClient();

    const defaultProps: Props = {
      onSelect: vi.fn(),
    };

    const props = { ...defaultProps, ...customProps };

    return render(
      <QueryClientProvider client={queryClient}>
        <MediaSearch {...props} />
      </QueryClientProvider>
    );
  };

  describe("renders correctly", () => {
    it("tv show search", async () => {
      const user = userEvent.setup();
      setup();

      await user.click(screen.getByRole("button", { name: "TV Show" }));

      expect(screen.getByLabelText("Search shows")).toBeInTheDocument();
    });

    it("movie search", async () => {
      const user = userEvent.setup();
      setup();

      await user.click(screen.getByRole("button", { name: "Movie" }));

      expect(screen.getByLabelText("Search movies")).toBeInTheDocument();
    });
  });

  it("calls setQuery when typed into", async () => {
    const user = userEvent.setup();
    const querySpy = vi.spyOn(searchQueries, "searchShows");
    setup();

    await user.type(screen.getByLabelText("Search shows"), "Foo");

    await sleep(1000);

    expect(querySpy).toHaveBeenCalledWith("Foo", "mock-token");

    await user.clear(screen.getByLabelText("Search shows"));
    await user.type(screen.getByLabelText("Search shows"), "Bar");

    await sleep(1000);

    expect(querySpy).toHaveBeenCalledWith("Bar", "mock-token");
  });
});
