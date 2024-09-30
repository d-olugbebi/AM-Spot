const express = require('express')
const REDIRECT_URI = "http://localhost:8080/callback"
const BASE_URL = "https://api.spotify.com"

const clientId = "" //add client id
const clientSecret = "" //add client secret

let completionCallback
const authComplete = new Promise((callback) => { completionCallback = callback })

let app = express();
function generateRandomString(length) {
    let text = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        text += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return text;
}

app.get('/login', function (req, res) {

    let state = generateRandomString(16);
    let scope = 'playlist-modify-private';

    const endpointParameter = new URLSearchParams({
        response_type: 'code',
        client_id: clientId,
        scope: scope,
        redirect_uri: REDIRECT_URI,
        state: state
    });

    res.redirect(`https://accounts.spotify.com/authorize?${endpointParameter.toString()}`)
});

app.get('/callback', function (req, res) {

    var code = req.query.code || null;
    var state = req.query.state || null;

    if (state === null) {
        res.redirect('/#' +
            querystring.stringify({
                error: 'state_mismatch'
            }));
    } else {
        completionCallback({ state, code })
    }
})      
async function getToken() {
    const response = await fetch('https://accounts.spotify.com/api/token', {
        mode: 'no-cors',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + (new Buffer.from(clientId + ':' + clientSecret).toString('base64')),
            'redirect': `${REDIRECT_URI}`
        },
        body: 'grant_type=client_credentials'
    });

    const data = await response.json();
    token = data.access_token
    return token
}


const trackName = "Superpowers" //get from AM-side
const artistName = "Daniel Caesar" //get from AM-side
const query = `${trackName} ${artistName}`
const q = query.toLowerCase().replaceAll(' ', '+')


async function findAMTrack(token) {
    const response = await fetch(`${BASE_URL}/v1/search?q=${q}&type=track&market=us&limit=3&offset=0`, {
        //incomplete function below so ignore 

        mode: 'no-cors',
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer' + token

        }
    })


    const data = await response.json();
    let tracks = data.id
    return tracks;
}



async function createPlaylist(token) {
    const userId = "" //add user Id
    const newPlaylistName = "HelloWorld"
    const response = await fetch(`${BASE_URL}/v1/users/${userId}/playlists`, {
        mode: 'no-cors',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: {
            "name": `"${newPlaylistName}"`,
            "description": "New playlist description",
            "public": false
        }
    })

    const data = await response.status;
    let playlistId = data.id
    console.log(playlistId)//  should return playlistId;
}

async function addTracks(token, playlistId) {
    const response = await fetch(BASE_URL + '/v1/playlists/' + playlistId + '/tracks', {
        mode: 'no-cors',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer' + token
        },
        body: {
            "uris": [
                "string" //need 
            ],
            "position": 0
        }
    })

    await response.json();
}

const main = async () => {
    let token = await getToken();
    await findAMTrack(token);
    let server;
const promise = new Promise((cb) => {
    server = app.listen(8080,  () => cb())
})
    await promise.then(() => {
        import('open').then(({ 'default': open }) => open("http://localhost:8080/login"))
    })
    .then(() => authComplete)
    .then(obj => console.log(obj))
    .then(() => server.close())

}

main() 



module.exports = { getToken, findAMTrack, main };