const puppeteer = require("puppeteer");
const XLSX = require("xlsx");

async function scrapeData() {
    // Launch headless Chrome browser
    const browser = await puppeteer.launch();

    // Open a new page
    const page = await browser.newPage();

	// Open list of websites from excel file
    const table = XLSX.readFile("ch websites.xlsx");
    const sheet = table.Sheets[table.SheetNames[0]];
    let range = XLSX.utils.decode_range(sheet["!ref"]);

	// Iterate through each row in the sheet
    for (let rowNum = range.s.r; rowNum <= range.e.r; rowNum++) {
        // Get first cell in each row
        const firstCell = sheet[XLSX.utils.encode_cell({ r: rowNum, c: 0 })];

		// Print content
        console.log("host: " + firstCell["w"]); 

		// Get title of each website
        try {
            await page.goto("https://" + firstCell["w"]);
            const title = await page.title();
            console.log(title);
		// If website is not reachable, print failed
        } catch (err) {
            console.log(err);
        }
    }
    // Close the browser
    await browser.close();

    // Return the extracted data
    return { title, content };
}

scrapeData().then((data) => {});
