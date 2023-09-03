/* eslint-disable @typescript-eslint/no-unused-vars */
import { expect } from "@playwright/test";
import type { Browser, Page } from "playwright";
import { chromium } from "playwright";
import type { PreviewServer } from "vite";
import { preview } from "vite";
import { afterAll, beforeAll, describe, test } from "vitest";

describe("Router", () => {
  // eslint-disable-next-line @typescript-eslint/prefer-ts-expect-error, @typescript-eslint/ban-ts-comment
  // @ts-ignore
  let server: PreviewServer;
  let browser: Browser;
  let page: Page;

  beforeAll(async () => {
    server = await preview({
      preview: {
        port: 3000,
      },
    });
    browser = await chromium.launch();
    // page = await browser.newPage();
    // const randomstr = Math.random().toString(36).substring(7);
    // await page.goto("http://localhost:3000/register");
    // await page.waitForSelector('input[name="name"]', { state: "visible" });
    // await page.fill('input[name="name"]', `${randomstr}`);
    // await page.fill('input[name="email"]', `${randomstr}@gmail.com`);
    // await page.fill('input[name="password"]', `My@${randomstr}!`);
    // await page.click('button[type="submit"]');
    // await page.close();
  });
  afterAll(async () => {
    await browser.close();
  });
  beforeEach(async () => {
    page = await browser.newPage();
  });
  afterEach(async () => {
    await page.close();
  });

  test.only("User redirected to home after register", async () => {
    const randomstr = Math.random().toString(36).substring(7);
    await page.goto("http://localhost:3000/register");
    await page.waitForSelector('input[name="name"]', { state: "visible" });
    await page.fill('input[name="name"]', `${randomstr}`);
    await page.fill('input[name="email"]', `${randomstr}@gmail.com`);
    await page.fill('input[name="password"]', `My@${randomstr}!`);
    await page.locator('button[type="submit"]').click();
    await expect(page).toHaveURL("http://localhost:3000");
  });

  test("go to the home page when user click on the home link", async () => {
    await page.goto("http://localhost:3000");
    await page.locator('header:first-child a[href="/"].active').click();
    await expect(page).toHaveURL("http://localhost:3000");
  });

  test("go to the contact page when user click on the contact link", async () => {
    await page.goto("http://localhost:3000");
    await page.locator('header:first-child a[href="/contacts"]').click();
    await expect(page).toHaveURL("http://localhost:3000/contacts");
  });
  test("go to the files page when user click on the files link", async () => {
    await page.goto("http://localhost:3000");
    await page.locator('a[href="/transfers"]').click();
    await expect(page).toHaveURL("http://localhost:3000/transfers");
  });
  test("go to the upload page when user click on the upload link", async () => {
    await page.goto("http://localhost:3000");
    await page.locator('a[href="/upload"]').first().click();
    await expect(page).toHaveURL("http://localhost:3000/upload");
  });
});
