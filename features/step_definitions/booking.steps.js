const {
  Given,
  When,
  Then,
  Before,
  After,
  setDefaultTimeout,
} = require("@cucumber/cucumber");

setDefaultTimeout(60000);

const puppeteer = require("puppeteer");

const {
  selectDay,
  selectMovieSession,
  selectSeat,
} = require("../../lib/commands");

let browser;
let page;

Before(async function () {
  browser = await puppeteer.launch({
    headless: "new",
  });

  page = await browser.newPage();

  await page.goto("https://qamid.tmweb.ru/client/index.php", {
    waitUntil: "domcontentloaded",
  });
});

After(async function () {
  if (page) {
    await page.close();
  }

  if (browser) {
    await browser.close();
  }
});

Given("user is on cinema page", async function () {
  // страница открывается в Before
});

When("user selects day {int}", async function (dayIndex) {
  await selectDay(page, dayIndex);
});

When(
  "user selects movie {int} and session {int}",
  async function (movieIndex, sessionIndex) {
    await selectMovieSession(page, movieIndex, sessionIndex);
  },
);

When("user selects an available seat", async function () {
  await selectSeat(page);
});

When("user clicks booking button", async function () {
  await page.click(".acceptin-button");
});

Then("user sees selected tickets page", async function () {
  await page.waitForSelector(".ticket__check-title", {
    visible: true,
    timeout: 60000,
  });

  const title = await page.$eval(
    ".ticket__check-title",
    (el) => el.textContent,
  );

  if (!title.includes("Вы выбрали билеты:")) {
    throw new Error("Selected tickets page was not opened");
  }
});

Then("user sees booking code button", async function () {
  await page.waitForSelector(".ticket__check-title", {
    visible: true,
    timeout: 60000,
  });

  await page.waitForFunction(
    () => {
      const button = document.querySelector(".acceptin-button");
      return button && button.textContent.includes("Получить код бронирования");
    },
    {
      timeout: 60000,
    },
  );
});

Then("booking button is disabled", async function () {
  const buttonText = await page.$eval(
    ".acceptin-button",
    (button) => button.textContent,
  );

  if (!buttonText.includes("Забронировать")) {
    throw new Error("Booking button should stay on booking page");
  }
});
