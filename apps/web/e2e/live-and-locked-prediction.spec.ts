import { expect, test } from "@playwright/test";

const liveMatchId = "01926000-0000-7000-8000-000000000701";

test("live page shows grouped active matches", async ({ page }) => {
  await page.goto("/live");

  await expect(page.getByRole("heading", { name: "En vivo" })).toBeVisible();
  await expect(page.getByText(/eventos activos/i)).toBeVisible();
  await expect(page.getByRole("heading", { name: "Futbol" })).toBeVisible();
  await expect(page.getByText("EN VIVO").first()).toBeVisible();
});

test("prediction is locked after a match starts", async ({ page }) => {
  await page.goto(`/matches/${liveMatchId}`);

  await page.getByRole("tab", { name: "Predicciones" }).click();

  await expect(page.getByRole("heading", { name: "Predicción gratuita" })).toBeVisible();
  await expect(page.getByText("Bloqueada").first()).toBeVisible();
  await expect(page.getByText("Los cambios se bloquean cuando el partido comienza.")).toBeVisible();
  await expect(page.getByRole("radio", { name: /local/i })).toBeDisabled();
  await expect(page.getByRole("radio", { name: /empate/i })).toBeDisabled();
  await expect(page.getByRole("radio", { name: /visitante/i })).toBeDisabled();
});
