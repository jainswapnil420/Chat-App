let users = [];

//addUser,removeUser,getUser,getAllUsers

const addUser = ({ id, username, room }) => {
    //Clean up the data
    username = username.trim().toLowerCase();
    room = room.trim().toLowerCase();

    //Validate data
    if (!username || !room) {
        return {
            error: 'username and room is required'
        }
    }

    //Check for existing user
    const existingUser = users.find((user) => {
        return user.username === username && user.room === room;
    })

    //Return if user exists in room
    if (existingUser) {
        return {
            error: 'User already exists in room'
        }
    }

    const user = { id, username, room };
    users.push(user);
    return { user };

}
const removeUser = (id) => {
    const indexOfUser = users.findIndex((user) => user.id === id);
    if (indexOfUser !== -1) {
        return users.splice(indexOfUser, 1)[0];
    }
}
const getUser = (id) => {
    const user = users.find((user) => user.id === id);
    if (!user) {
        return {
            error: 'User does not exist in room'
        }
    }

    return user;
}
const getUsersInRooms = (room) => {
    const userList = users.filter((user) => user.room === room.trim().toLowerCase());
    if (!userList) {
        return {
            error: 'No Users in this room'
        }
    }
    return userList;
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRooms
}