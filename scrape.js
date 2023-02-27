const puppeteer = require("puppeteer");
const XLSX = require("xlsx");
const sqlite3 = require("sqlite3").verbose();

async function scrapeData() {
  // Launch headless Chrome browser
  const browser = await puppeteer.launch();

  // Open a new page
  const page = await browser.newPage();

  // Navigate to the website
  //   await page.goto("https://www.thelocalsessions.com");

  //   const pageUrls = await page.evaluate(() => {
  //     const urlArray = Array.from(document.links).map((link) => link.href);
  //     const uniqueUrlArray = [...new Set(urlArray)];
  //     return uniqueUrlArray;
  //   });

  //   console.log(pageUrls);

  const table = XLSX.readFile("ch websites.xlsx");
  const sheet = table.Sheets[table.SheetNames[0]];
  var range = XLSX.utils.decode_range(sheet["!ref"]);
  for (let rowNum = range.s.r; rowNum <= 300; rowNum++) {
    // Example: Get second cell in each row, i.e. Column "B"
    const secondCell = sheet[XLSX.utils.encode_cell({ r: rowNum, c: 0 })];
    // NOTE: secondCell is undefined if it does not exist (i.e. if its empty)
    console.log("host: "+ secondCell['w']); // secondCell.v contains the value, i.e. string or number
    try{
        await page.goto("https://"+ secondCell['w']);
        const title = await page.title();
        console.log(title);
    }
    catch(err){
        console.log('failed');
    }
  }
  // Extract the desired data
  const title = await page.title();
  const content = await page.content();

  // Close the browser
  await browser.close();

  // Return the extracted data
  return { title, content };
}

scrapeData().then((data) => {});
