import { expect, test } from '@playwright/test'

test('un visitante sin sesión es dirigido al acceso', async ({ page }) => {
  await page.goto('/dashboard')

  await expect(page).toHaveURL(/\/login$/)
  await expect(page.getByRole('heading', { name: 'Vuelve al tablero' })).toBeVisible()
  await expect(page.getByLabel('Correo electrónico')).toBeVisible()
})
