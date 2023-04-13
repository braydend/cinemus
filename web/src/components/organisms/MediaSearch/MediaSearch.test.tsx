import { describe, expect, it, vi } from "vitest";
import { act, render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ComponentProps } from "react";
import userEvent from "@testing-library/user-event";
import { MediaSearch } from "./MediaSearch";
import * as searchQueries from "../../../queries/search";
import { sleep } from "../../../../tests/sleep";

type Props = ComponentProps<typeof MediaSearch>;

vi.mock("../../../hooks/useGetAuthToken", () => ({
  useGetAuthToken: () => ({
    authToken: "mock-token",
  }),
}));
describe("<MediaSearch />", () => {
  const setup = (customProps?: Partial<Props>) => {
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

  it("renders correctly", () => {
    setup();

    expect(screen.getByLabelText("Search")).toBeInTheDocument();
  });

  it("calls setQuery when typed into", async () => {
    const user = userEvent.setup();
    const querySpy = vi.spyOn(searchQueries, "searchShows");
    setup();

    await user.type(screen.getByLabelText("Search"), "Foo");

    await sleep(1000);

    expect(querySpy).toHaveBeenCalledWith("Foo", "mock-token");

    await user.clear(screen.getByLabelText("Search"));
    await user.type(screen.getByLabelText("Search"), "Bar");

    await sleep(1000);

    expect(querySpy).toHaveBeenCalledWith("Bar", "mock-token");
  });
});
