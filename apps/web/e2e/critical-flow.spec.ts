import { expect, test } from "@playwright/test";

const scheduledMatchId = "01926000-0000-7000-8000-000000000728";

test("Inicio -> Partido -> Predicción -> Ranking -> Perfil", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Partidos para predecir" })).toBeVisible();
  await expect(page.getByText("Predicciones populares")).toBeVisible();

  await page.goto(`/matches/${scheduledMatchId}`);
  await expect(page.getByRole("heading", { name: "Condores Basket" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Halcones Basket" })).toBeVisible();

  await page.getByRole("tab", { name: "Predicciones" }).click();
  await expect(page.getByRole("heading", { name: "Predicción gratuita" })).toBeVisible();

  await page.getByRole("radio", { name: /visitante/i }).click();
  await expect(page.getByText("Confirmación")).toBeVisible();
  await page.getByRole("button", { name: "Confirmar predicción" }).click();
  await expect(page.getByText(/Selección actual: Visitante|Selección actual: Registrada/i)).toBeVisible();

  await page.goto("/ranking");
  await expect(page.getByRole("heading", { name: "Tabla de comunidad" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Capitan Andino" })).toBeVisible();

  await page.goto("/profile");
  await expect(page.getByRole("heading", { name: "Capitan Andino" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Logros" })).toBeVisible();
});
