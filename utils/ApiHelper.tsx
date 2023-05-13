import { AuthApiControllerImplApi, Configuration, PartyApiControllerImplApi } from '../generated'

let configuration = new Configuration({
    basePath: 'https://songvoter.party',
    headers: {
        'Content-Type': 'application/json'
    }
})

export let AuthController = new AuthApiControllerImplApi(configuration)
export let PartyController = new PartyApiControllerImplApi(configuration)
