const { Builder, Browser, By, Key,until} = require('selenium-webdriver');
const { elementIsVisible, elementLocated } = require('selenium-webdriver/lib/until');

let driver = new Builder().forBrowser(Browser.CHROME).build(); 
 



async function openGoogle(){
await driver.manage().window().maximize();
await driver.get('https://www.google.com/');
console.log('Browser opened;Google opened');

}

openGoogle()

async function disablePopUp(){
    var closeButton = await driver.wait(until.elementLocated(By.css("button#W0wltc div.QS5gu.sy4vM")),10000)
     driver.wait(until.elementIsEnabled(closeButton), 10000).click()
    // await closeButton.click();
    console.log('popup disabled')

}

disablePopUp()
