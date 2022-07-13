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

export default {
    getUsers,
    getUserPassword
}