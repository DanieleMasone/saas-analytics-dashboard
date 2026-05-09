import {useQueryClient} from "@tanstack/react-query";
import {render, screen} from "@testing-library/react";
import {ReactQueryProvider} from "@/providers/react-query-provider";

function QueryClientProbe() {
  const queryClient = useQueryClient();
  const retry = queryClient.getDefaultOptions().queries?.retry;

  return <span>retry:{String(retry)}</span>;
}

describe("ReactQueryProvider", () => {
  it("provides the configured TanStack Query client to descendants", () => {
    render(
        <ReactQueryProvider>
          <QueryClientProbe/>
        </ReactQueryProvider>,
    );

    expect(screen.getByText("retry:1")).toBeInTheDocument();
  });
});
