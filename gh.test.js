const { TimeoutSettings } = require("puppeteer");

let page;

const fish = (async (url, selector) => {
  page = await browser.newPage();
  await page.goto(url);
  await page.waitForSelector(selector);
  const title2 = await page.$(selector);
  const value = await page.evaluate(el => el.textContent, title2);
  return value;
});

describe("Github page tests", () => {

  beforeEach(async () => {
    page = await browser.newPage();
    await page.goto("https://github.com/team");
  });

  afterEach(() => {
    page.close();
  });

  test("The h1 header content'", async () => {
    const firstLink = await page.$("header div div a");
    await firstLink.click();
    await page.waitForSelector('h1');

    const headerText = await page.$("h1");
    const value = await page.evaluate(el => el.textContent, headerText);
    expect(value).toEqual('Build like the best teams on the planet');

    /*
    // original code with mistake - check title text
    const title2 = await page.title();
    expect(title2).toEqual('GitHub: Where the world builds software · GitHub');
    */
  }, 5000);

  test("The first link attribute", async () => {
    const actual = await page.$eval("a", link => link.getAttribute('href') );
    expect(actual).toEqual("#start-of-content");
  }, 5000);

  test("The page contains Sign in button", async () => {
    const btnSelector = ".btn-large-mktg.btn-mktg";
    await page.waitForSelector(btnSelector, {
      visible: true,
    });
    const actual = await page.$eval(btnSelector, link => link.textContent);
    expect(actual).toContain("Sign up for free")
  }, 5000);
});

describe("Second task - add 3 new tests", () => {

  afterEach(() => {
    page.close();
  });

  test("Check h1 on first page", async () => {
    expect(await fish("https://github.com/marketplace?type=actions", "h1")).toEqual("Actions");
  });

  test("Check h1 on first page", async () => {
    expect(await fish("https://github.com/customer-stories?type=team", "h1"))
    .toEqual("TELUS streamlines productivity by replacing their DevOps tools with GitHub");
  });

  test("Check h1 on first page", async () => {
    //В тексте h1 используется неразрывный пробел &nbsp; его код 160 или '\xa0'
    expect(await fish("https://github.com/features/security", "h1")).toEqual(`Secure at every`+String.fromCharCode(160)+`step`);
  });

});

describe("Third task - Netology site with timeout", () => {
  beforeAll( async() => {
    page = await browser.newPage();
    page.setDefaultNavigationTimeout(0);
    page.setDefaultNavigationTimeout(90000);
    await page.goto("https://netology.ru/");    
  });

  afterAll(() => {
    page.close();
  });

  test(`Check Title on first page`, async () => {    
    await page.waitForSelector("title");
    const title2 = await page.$("title");
    const value = await page.evaluate(el => el.textContent, title2);
    expect(value).toEqual("Нетология – курсы и обучение интернет-профессиям онлайн");
  });

  test("The first link attribute", async () => {
    const actual = await page.$eval("a", link => link.getAttribute('href') );
    expect(actual).toEqual("/legal/24");
  });  

  test("The page contains Sign in button", async () => {
    const btnSelector = ".src-shared-components-Header--loginLink--aIJO3";
    const actual =  await page.$eval(btnSelector, link => link.textContent);
    expect(actual).toContain("Войти")
  });
  
});
