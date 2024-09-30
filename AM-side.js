
const { Builder, Browser, By, Key,until} = require('selenium-webdriver');
const { elementIsVisible, elementLocated } = require('selenium-webdriver/lib/until');
const { text } = require('stream/consumers');

let driver = new Builder().forBrowser(Browser.CHROME).build()
let query = 'Daniel Caesar Essentials' //make a user input box
 
async function openAM(){
await driver.manage().window().maximize();
await driver.get('https://music.apple.com/us/new');
console.log('Browser opened; Apple Music opened');
}

async function disablePopUp(){
    var closeButton = await driver.wait(until.elementLocated(By.css('button.close-button.svelte-1nvnskn')),10000)
     driver.wait(until.elementIsVisible(closeButton), 10000).click()
    // await closeButton.click();
    console.log('popup disabled')
}

// async function logIn(email,password){
//     email = 'faker@gmail.com' 
//     password = 'password***' //use AM password
//     var signInButton =  await driver.wait(until.elementLocated(By.css('[data-testid = "sign-in-button"] span.button-text')),5000)
//      signInButton.click();
// }

async function goHome() {
    let navHome = await driver.wait(until.elementLocated(By.css('[data-testid="home"] span.svelte-877xlo')),5000)
    navHome.click()
}

async function searchQuery() {
    
    let search = await driver.wait(until.elementLocated(By.css('input[type = "search"]')),5000)
    search.click()
    search.sendKeys(query,Key.ENTER)
    // let firstDropdown = await driver.wait(until.elementLocated(By.css('li[data-index="0"] span.suggestion>span[data-testid="suggestion-autofill-before"]')),5000)
    // firstDropdown.click()
    console.log(`"${query}" search executed`)
}

async function findPlaylist() {
    let playlistsHeader = await driver.wait(until.elementLocated(By.css('div[aria-label ="Playlists"] button>span.dir-wrapper')))
    playlistsHeader.click()
    let playlists = await driver.wait(until.elementsLocated(By.css('div.section.with-top-spacing[aria-label="Playlists"] span.multiline-clamp__text>a')))
    
    console.log(`${playlists.length} playlists found`) //need to scroll down the page to get all results

    for (let playlist of playlists){
        let playlistName = await playlist.getText()
        if (playlistName.toLowerCase() === query.toLowerCase()){
            console.log(`playlist found: ${playlistName}`)
            playlist.click()
        } else{ continue}
    }
    
}

let exportPlaylist = []
async function getPlaylistSongs() { 
    let songs = await driver.wait(until.elementsLocated(By.css('div.songs-list-row__song-name.svelte-113if15')))
    let artists = await driver.wait(until.elementsLocated(By.css('div.songs-list__col--secondary.svelte-113if15')))
    let albums = await driver.wait(until.elementsLocated(By.css('div.songs-list div.songs-list__col--tertiary.svelte-113if15')))
    for (let i = 0;i<artists.length;i++){
        exportPlaylist.push(`{"song":"${await songs[i].getText()}", "artist":"${await artists[i].getText()}", "album":"${await albums[i].getText()}"}`)
        }
console.log("Exporting playlist")
}


openAM()
    .then(searchQuery)
    .then(findPlaylist)
    .then(getPlaylistSongs)
   .then(async () => console.log(exportPlaylist))


// browser.quit();
