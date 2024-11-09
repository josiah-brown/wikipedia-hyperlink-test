import { Builder, Browser, By } from "selenium-webdriver"
import fs from 'fs'

const main = async () => {
    const START_URL = 'https://en.wikipedia.org/wiki/Perlin_noise' // url that the program starts from
    const TARGET_URL = 'https://en.wikipedia.org/wiki/Philosophy' // philosophy url that the program looks for
    const SEARCH_DEPTH = 100; // program will stop of it has not found philosophy page by this number
    const LINK_SELECTOR = 'div.mw-content-ltr > p > a:first-of-type' // selector for first link on a wikipedia page

    let driver;

    try {
        // set up the Selenium driver for Chrome
        driver = await new Builder().forBrowser(Browser.CHROME).build()

        // open the start page
        await driver.get(START_URL)

        // init variables for the loop
        let urlPath = [START_URL];
        let currDepth = 0;

        // loop until the philosophy page is found or until SEARCH_DEPTH is reached
        while (currDepth < SEARCH_DEPTH) {

            // get the first link
            let firstLink = await driver.findElement(By.css(LINK_SELECTOR))
    
            // click the first link
            await firstLink.click()
    
            // get the url of the new page
            const newUrl = await driver.getCurrentUrl()

            // update paths array with new url
            urlPath = [...urlPath, newUrl]
    
            // if we've reached philosophy page, break out of loop
            if (newUrl === TARGET_URL) {
                break
            }

            // increment counter
            currDepth++
        }

        // Output the urlPath to a file using fs module
        let data = urlPath.join('\n');
        data = `Total link count: ${urlPath.length}\n\n` + data
        const filePath = './path.txt'
        fs.writeFile(filePath, data, (err) => {
            if (err) {
                console.error('Error writing to file:', err);
            } else {
                console.log('Path successfully written to file:', filePath);
            }
        });
    } catch (e) {
        console.log(e)
    } finally {
        await driver.quit()
    }
}

await main()