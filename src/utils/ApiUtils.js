export const VRChatAPIGet = {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'User-Agent': 'VT'
        }
    }

export const VRChatAPIPost = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'User-Agent': 'VT'
        }
    }

export function VRChatImage(uri) {
    return {
        uri: uri,
        method: 'GET',
        headers: {
            'User-Agent': 'VT'
        }
    }
}