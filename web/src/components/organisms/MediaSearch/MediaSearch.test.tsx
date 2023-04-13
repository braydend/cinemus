import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { SearchBox } from "./SearchBox";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ComponentProps } from "react";
import userEvent from "@testing-library/user-event";

type Props = ComponentProps<typeof SearchBox>;

describe("<Searchbox />", () => {
  const setup = (customProps?: Partial<Props>) => {
    const queryClient = new QueryClient();

    const defaultProps: Props = {
      mediaType: "movie",
      onSelect: vi.fn(),
      query: "",
      setQuery: vi.fn(),
    };

    const props = { ...defaultProps, ...customProps };

    return render(
      <QueryClientProvider client={queryClient}>
        <SearchBox {...props} />
      </QueryClientProvider>
    );
  };

  it("renders correctly", () => {
    setup();

    expect(screen.getByLabelText("Search")).toBeInTheDocument();
  });

  it("calls setQuery when typed into", async () => {
    const user = userEvent.setup();
    const mockSetQuery = vi.fn();
    setup({ setQuery: mockSetQuery });

    await user.type(screen.getByLabelText("Search"), "Tree");

    expect(mockSetQuery).toHaveBeenCalledWith("T");
    expect(mockSetQuery).toHaveBeenCalledWith("Tr");
    expect(mockSetQuery).toHaveBeenCalledWith("Tre");
    expect(mockSetQuery).toHaveBeenCalledWith("Tree");
  });
});
