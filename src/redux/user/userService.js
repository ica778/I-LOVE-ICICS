const getUsers = async (userId) => {
    const response = await fetch('http://localhost:3001/user', {
        method: 'GET'
    });
    return response.json();
}

const getUserPassword = async (userId) => {
    const response = await fetch('http://localhost:3001/user', {
        method: 'GET'
    });
    return response.json();
}

const addUser = async (credentials) => {
    const response = await fetch('http://localhost:3001/user/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    });
    const data = await response.json();
    if (!response.ok) {
        const errorMsg = data?.message;
        throw new Error(errorMsg)
    }
    return data;
}

export default {
    getUsers,
    getUserPassword,
    addUser
}