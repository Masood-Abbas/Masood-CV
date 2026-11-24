import { beforeEach, describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import App from "@/App";
import { DEFAULT_ADMIN_PASSWORD } from "@/data/auth";

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
  window.history.pushState({}, "", "/admin");
});

describe("admin route protection", () => {
  it("shows the password gate instead of the panel", async () => {
    render(<App />);

    expect(await screen.findByRole("heading", { name: /admin access/i })).toBeInTheDocument();
    expect(screen.queryByText(/Welcome back/i)).not.toBeInTheDocument();
  });

  it("unlocks the panel with the default password", async () => {
    render(<App />);

    const passwordInput = await screen.findByLabelText(/^password$/i);
    fireEvent.change(passwordInput, { target: { value: DEFAULT_ADMIN_PASSWORD } });
    fireEvent.click(screen.getByRole("button", { name: /unlock admin/i }));

    expect(await screen.findByText(/Welcome back/i, undefined, { timeout: 4000 })).toBeInTheDocument();
  });

  it("shows an error for a wrong password", async () => {
    render(<App />);

    const passwordInput = await screen.findByLabelText(/^password$/i);
    fireEvent.change(passwordInput, { target: { value: "not-the-password" } });
    fireEvent.click(screen.getByRole("button", { name: /unlock admin/i }));

    expect(await screen.findByText(/That password is incorrect/i)).toBeInTheDocument();
  });
});
