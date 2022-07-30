const getUsers = async (userId) => {
    const response = await fetch('https://i-love-icics-backend.herokuapp.com/user', {
        method: 'GET'
    });
    return response.json();
}

const getUsersSearchName = async (userString) => {
    const response = await fetch('https://i-love-icics-backend.herokuapp.com/user' + userString, {
        method: 'GET'
    });
    return response.json();
}

const getUserPassword = async (userId) => {
    const response = await fetch('https://i-love-icics-backend.herokuapp.com/user', {
        method: 'GET'
    });
    return response.json();
}

const addUser = async (credentials) => {
    const response = await fetch('https://i-love-icics-backend.herokuapp.com/user/create', {
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

const updateAccountInformation = async (data) => {
    console.log(JSON.stringify(data));
    const response = await fetch('https://i-love-icics-backend.herokuapp.com/user/update', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    const responseVal = await response.json();
    if (!response.ok) {
        const errorMsg = data?.message;
        throw new Error(errorMsg)
    }
    return responseVal;
}

export default {
    getUsers,
    getUserPassword,
    addUser,
    getUsersSearchName,
    updateAccountInformation
}