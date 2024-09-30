//import { afterAll, beforeEach, afterEach, expect, describe, it, test, jest } from '@jest/globals'
const {getToken,findAMTrack} =require('./Spot-side.js')

describe(getToken, ()=>{
    // it('should successfully POST request', async ()=>{
    //     let t = await getToken()
    //     expect(t.status).toBe(200)
    // })
    it('should generate a token', async ()=>{
        const t = await getToken()
        expect(t).toBeDefined()
        
    })
})


