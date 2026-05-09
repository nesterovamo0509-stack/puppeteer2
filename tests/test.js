const {
  bookTicket,
  selectDay,
  selectMovieSession,
} = require("../lib/commands");

let page;

beforeEach(async () => {
  page = await browser.newPage();

  await page.goto("https://qamid.tmweb.ru/client/index.php", {
    waitUntil: "domcontentloaded",
  });
}, 30000);

afterEach(async () => {
  if (page) {
    await page.close();
  }
});

describe("Cinema ticket booking", () => {
  test("Happy path: user can book one ticket", async () => {
    const bookingData = {
      dayIndex: 4,
      movieIndex: 0,
      sessionIndex: 0,
    };

    await bookTicket(page, bookingData);

    const button = await page.$(".acceptin-button");

    expect(button).toBeTruthy();
  }, 60000);

  test("Happy path: user can get booking code button", async () => {
    const bookingData = {
      dayIndex: 4,
      movieIndex: 0,
      sessionIndex: 0,
    };

    await bookTicket(page, bookingData);

    const buttonText = await page.$eval(".acceptin-button", (el) =>
      el.textContent.trim(),
    );

    expect(buttonText).toContain("Получить код бронирования");
  }, 60000);

  test("Sad path: user cannot book ticket without selecting seat", async () => {
    await selectDay(page, 1);
    await selectMovieSession(page, 0, 0);

    const isDisabled = await page.$eval(".acceptin-button", (button) => {
      return (
        button.disabled || button.classList.contains("acceptin-button-disabled")
      );
    });

    expect(isDisabled).toBe(true);
  }, 30000);
});
