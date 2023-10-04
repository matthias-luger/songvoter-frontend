import { MMKV } from 'react-native-mmkv'

class MMKVWithTTL extends MMKV {
    constructor() {
        super()
    }

    get uuid() {
        return ''
    }

    set uuid(value: string) {
        this.uuid = value
    }

    private deleteIfTTLIsExpired(key: string) {
        if (super.contains(`${key}-ttl`)) {
            let ttl = super.getNumber(`${key}-ttl`)
            if (new Date(ttl).getTime() < new Date().getTime()) {
                super.delete(`${key}-ttl`)
                super.delete(key)
            }
        }
    }

    setWithTTL(key: string, value: string | number | boolean | Uint8Array, timeToLiveInMilliseconds: number) {
        super.set(key, value)
        super.set(`${key}-ttl`, new Date().getTime() + timeToLiveInMilliseconds)
    }

    contains(key: string): boolean {
        this.deleteIfTTLIsExpired(key)
        return super.contains(key)
    }

    getString(key: string) {
        this.deleteIfTTLIsExpired(key)
        return super.getString(key)
    }

    getBoolean(key: string): boolean {
        this.deleteIfTTLIsExpired(key)
        return super.getBoolean(key)
    }

    getNumber(key: string): number {
        this.deleteIfTTLIsExpired(key)
        return super.getNumber(key)
    }

    getBuffer(key: string): Uint8Array {
        this.deleteIfTTLIsExpired(key)
        return super.getBuffer(key)
    }

    delete(key: string): void {
        if (super.contains(`${key}-ttl`)) {
            super.delete(`${key}-ttl`)
        }
        return super.delete(key)
    }
}
export const storage = new MMKVWithTTL()

export const GOOGLE_AUTH_OBJECT = 'googleAuthObject'
export const SPOTIFY_TOKEN = 'spotifyToken'
export const USER_INFO = 'userInfo'
export const IS_CURRENTLY_PARTY_OWNER = 'isPartyOwner'
export const YOUR_SONGS = 'yourSongs'
export const CURRENT_PARTY = 'currentParty'
export const PLATFORMS_USED_IN_SEARCH = 'platformsUsedInSearch'
