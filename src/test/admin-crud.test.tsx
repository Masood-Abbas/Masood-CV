import { beforeEach, describe, expect, it } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import App from "@/App";
import { DEFAULT_ADMIN_PASSWORD } from "@/data/auth";
import { loadPortfolio } from "@/data/store";

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
  window.history.pushState({}, "", "/admin");
});

async function signIn() {
  render(<App />);
  const passwordInput = await screen.findByLabelText(/^password$/i);
  fireEvent.change(passwordInput, { target: { value: DEFAULT_ADMIN_PASSWORD } });
  fireEvent.click(screen.getByRole("button", { name: /unlock admin/i }));
  await screen.findByText(/Welcome back/i, undefined, { timeout: 4000 });
}

describe("admin project management", () => {
  it("adds a project and persists it", async () => {
    await signIn();

    fireEvent.click(screen.getByRole("button", { name: "Projects" }));
    await screen.findByRole("heading", { level: 1, name: "Projects" });

    fireEvent.click(screen.getByRole("button", { name: /add project/i }));

    const titleInput = await screen.findByLabelText(/project title/i);
    fireEvent.change(titleInput, { target: { value: "Brand New Project" } });
    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: "A project created from the admin panel." },
    });

    fireEvent.click(screen.getByRole("button", { name: /save project/i }));

    await waitFor(() => {
      expect(screen.getByText("Brand New Project")).toBeInTheDocument();
    });

    const saved = loadPortfolio();
    expect(saved.projects.some((project) => project.title === "Brand New Project")).toBe(true);
  });

  it("edits an existing project", async () => {
    await signIn();

    fireEvent.click(screen.getByRole("button", { name: "Projects" }));
    await screen.findByRole("heading", { level: 1, name: "Projects" });

    const editButtons = await screen.findAllByLabelText(/^Edit project$/);
    fireEvent.click(editButtons[0]);

    const titleInput = await screen.findByLabelText(/project title/i);
    fireEvent.change(titleInput, { target: { value: "Renamed Project" } });
    fireEvent.click(screen.getByRole("button", { name: /save project/i }));

    await waitFor(() => {
      expect(loadPortfolio().projects[0].title).toBe("Renamed Project");
    });
  });

  it("deletes a project after confirmation", async () => {
    await signIn();

    fireEvent.click(screen.getByRole("button", { name: "Projects" }));
    await screen.findByRole("heading", { level: 1, name: "Projects" });

    const before = loadPortfolio().projects.length;
    const deleteButtons = await screen.findAllByLabelText(/^Delete project$/);
    fireEvent.click(deleteButtons[0]);

    fireEvent.click(await screen.findByRole("button", { name: "Delete" }));

    await waitFor(() => {
      expect(loadPortfolio().projects).toHaveLength(before - 1);
    });
  });

  it("keeps other sections in sync with the same store", async () => {
    await signIn();

    fireEvent.click(screen.getByRole("button", { name: "Profile & SEO" }));
    const firstName = await screen.findByLabelText(/first name/i);
    fireEvent.change(firstName, { target: { value: "Zainab" } });

    await waitFor(() => {
      expect(loadPortfolio().site.firstName).toBe("Zainab");
    });
  });
});
