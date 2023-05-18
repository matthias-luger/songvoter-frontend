import { AuthApiControllerImplApi, Configuration, PartyApiControllerImplApi } from '../generated'
import { GOOGLE_TOKEN, storage } from './StorageUtils'

function getConfiguration(): Configuration {
    let apiToken = storage.getString(GOOGLE_TOKEN)
    let config = new Configuration({
        basePath: 'https://songvoter.party',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    if (apiToken) {
        config.headers.Authorization = `Bearer ${apiToken}`
    }
    return config
}

export let AuthController = new AuthApiControllerImplApi(getConfiguration())
export let PartyController = new PartyApiControllerImplApi(getConfiguration())
