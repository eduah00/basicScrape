const puppeteer = require('puppeteer');
const fs = require('fs/promises');
const { IncomingMessage } = require('http');

async function start() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://learnwebcode.github.io/practice-requests/');
    //Gets the name of the pets
    const results = await page.evaluate(() => {
        return Array.from(document.querySelectorAll(".info strong")).map(x => x.textContent)
    })    
    await fs.writeFile("results.txt", results.join("\n"));
    //Clicks the first button and logs the resulting text
    await page.click("#clickme")
    const clickedData = await page.$eval("#data", el => el.textContent)
    console.log(clickedData)

    await page.type("#ourfield", "blue")
    await Promise.all([page.click("#ourform button"), page.waitForNavigation()])

    const info = await page.$eval("#message", el => el.textContent)
    console.log(info)

    //Search for pet images and returns images of the pets
    const photos = await page.$$eval("img", (imgs) => {
        return imgs.map(x => x.src)
    })

    for (const photo of photos) {
        const response = await page.goto(photo);
        await fs.writeFile(photo.split("/").pop(), await response.buffer());
    }

    await browser.close();
}

start();