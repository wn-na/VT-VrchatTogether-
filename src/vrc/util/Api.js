const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'User-Agent': 'VT'
}

export const API_GET = {
    method: 'GET',
    headers: {
        ...headers
    }
}

export const API_DELETE = {
    method: 'DELETE',
    headers: {
        ...headers
    }
}

export const API_POST = {
    method: 'POST',
    headers: {
        ...headers
    }
}

export const API_PUT = {
    method: 'PUT',
    headers: {
        ...headers
    }
}

export const apiBody = (body, method = 'POST') => ({
    method: method,
    headers: {
        ...headers
    },
    body: JSON.stringify(body)
})

export const getImage = (uri) => ({
    uri: uri,
    method: 'GET',
    headers: {
        'User-Agent': 'VT'
    }
})

export const authApi = (auth, method = 'GET') => ({
    method: method,
    headers: {
        ...headers,
        'Authorization': `Basic ${auth}`
    }
});