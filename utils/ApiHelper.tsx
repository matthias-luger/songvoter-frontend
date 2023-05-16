import { AuthApiControllerImplApi, Configuration, PartyApiControllerImplApi } from '../generated'
import { API_TOKEN, storage } from './StorageUtils'

function getConfiguration(): Configuration {
    console.log('test')
    let apiToken = storage.getString(API_TOKEN)
    let config = new Configuration({
        basePath: 'https://songvoter.party',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    if (apiToken) {
        config.headers.Authorization = `Bearer ${apiToken}`
    }
    console.log(config)
    return config
}

export let AuthController = new AuthApiControllerImplApi(getConfiguration())
export let PartyController = new PartyApiControllerImplApi(getConfiguration())
