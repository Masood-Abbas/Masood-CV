import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "@/App";
import { loadPortfolio, savePortfolio } from "@/data/store";

// The WebGL background cannot render in jsdom; the page content is what matters here.
vi.mock("@/components/3d/Interactive3DBackground", () => ({
  default: () => null,
}));

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
  window.history.pushState({}, "", "/");
});

describe("public site", () => {
  it("renders the default portfolio content", async () => {
    render(<App />);

    expect(await screen.findByText("Masood Abbas")).toBeInTheDocument();
    expect(screen.getByText(/MERN Stack Developer/)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /About Me/i })).toBeInTheDocument();
    expect(screen.getByText("E-commerce Website")).toBeInTheDocument();
    expect(screen.getByText("Social Media App")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Frontend" })).toBeInTheDocument();
  });

  it("reflects saved admin edits immediately", async () => {
    const data = loadPortfolio();
    data.hero.name = "Edited Hero Name";
    data.sections.about.title = "Edited About Heading";
    data.hero.techTags = ["OnlyThisTag"];
    data.projects = [];
    data.experiences = [];
    savePortfolio(data);

    render(<App />);

    expect(await screen.findByText("Edited Hero Name")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Edited About Heading" })).toBeInTheDocument();
    expect(screen.getByText("OnlyThisTag")).toBeInTheDocument();

    // Sections with no items are hidden entirely.
    expect(screen.queryByRole("heading", { name: /^Projects$/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: /^Experience$/i })).not.toBeInTheDocument();
  });

  it("keeps the admin panel out of the public page", () => {
    render(<App />);
    expect(screen.queryByText(/Admin access/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Welcome back/i)).not.toBeInTheDocument();
  });
});
