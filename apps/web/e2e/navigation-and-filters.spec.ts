import { expect, test } from "@playwright/test";

test("login redirects to home with valid demo credentials", async ({ page }) => {
  await page.goto("/login");

  await page.getByLabel("Email").fill("usuario1@competencias.local");
  await page.getByLabel("Contraseña").fill("password123");
  await page.getByRole("button", { name: "Iniciar sesión" }).click();

  await expect(page.getByText("Sesión iniciada. Redirigiendo al inicio.")).toBeVisible();
  await expect(page).toHaveURL("/");
});

test("sports navigation applies match filters through query params", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("link", { name: "Fútbol" }).click();

  await expect(page).toHaveURL(/\/matches\?sport=football/);
  await expect(page.getByRole("heading", { name: "Calendario deportivo" })).toBeVisible();
  await expect(page.locator("select").first()).toHaveValue("football");
});

test("match status filters show live and finished lists", async ({ page }) => {
  await page.goto("/matches");

  await page.getByRole("button", { name: "En vivo" }).click();
  await expect(page).toHaveURL(/status=live/);
  await expect(page.getByText("EN VIVO").first()).toBeVisible();

  await page.getByRole("button", { name: "Finalizados" }).click();
  await expect(page).toHaveURL(/status=finished/);
  await expect(page.getByText("Finalizado").first()).toBeVisible();
});
