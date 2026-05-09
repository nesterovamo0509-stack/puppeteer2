const selectDay = async (page, dayIndex = 1) => {
  const days = await page.$$(".page-nav__day");
  await days[dayIndex].click();
};

const selectMovieSession = async (page, movieIndex = 0, sessionIndex = 0) => {
  await page.waitForSelector(".movie");

  const movies = await page.$$(".movie");
  const sessions = await movies[movieIndex].$$(".movie-seances__time");

  await sessions[sessionIndex].click();

  await page.waitForSelector(".buying-scheme", {
    visible: true,
  });
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const selectSeat = async (page) => {
  await sleep(3000);
  await page.waitForSelector(".buying-scheme__chair", {
    visible: true,
  });

  await page.click(".buying-scheme__chair");
};

const bookTicket = async (page, { dayIndex, movieIndex, sessionIndex }) => {
  await selectDay(page, dayIndex);
  await selectMovieSession(page, movieIndex, sessionIndex);
  await selectSeat(page);

  await page.waitForFunction(
    () => {
      const button = document.querySelector(".acceptin-button");
      return button && !button.disabled;
    },
    {
      timeout: 10000,
    },
  );

  await Promise.all([
    page.waitForNavigation({ waitUntil: "domcontentloaded", timeout: 30000 }),
    page.click(".acceptin-button"),
  ]);

  await page.waitForSelector(".acceptin-button", { timeout: 10000 });
};

module.exports = {
  selectDay,
  selectMovieSession,
  selectSeat,
  bookTicket,
};
