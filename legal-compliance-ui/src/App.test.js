import { render, screen } from "@testing-library/react";
import App from "./App";

jest.mock("axios", () => ({
  create: () => ({
    get: jest.fn(() => Promise.resolve({ data: [] })),
    post: jest.fn(),
    interceptors: { request: { use: jest.fn() }, response: { use: jest.fn() } },
  }),
}));

test("renders the executive command center inside the app shell", async () => {
  render(<App />);
  expect(
    await screen.findByText(/Executive Command Center/i),
  ).toBeInTheDocument();
  expect(screen.getAllByText(/Risk Heatmap/i).length).toBeGreaterThan(0);
});
