export const VRChatAPIGet = {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'User-Agent': 'VT'
        }
    }

export const VRChatAPIDelete = {
    method: 'DELETE',
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

export const VRChatAPIPut = {
    method: 'PUT',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': 'VT'
    }
}

export function VRChatAPIPostBody(body) {
    return {
       method: 'POST',
       headers: {
           'Accept': 'application/json',
           'Content-Type': 'application/json',
           'User-Agent': 'VT'
       },
       body : JSON.stringify(body)
   }
}

export function VRChatAPIPutBody(body) {
     return {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'User-Agent': 'VT'
        },
        body : JSON.stringify(body)
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

export function VRChatAPIGetAuth(key) {
    return {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'User-Agent': 'VT',
            'Authorization': `Basic ${key}`
        }
    }
}