const generateMessage = (username, text) => {
    return {
        username: username,
        text: text,
        createdAt: new Date()
    };
}

const generateLocationMessage = (username, url) => {
    return {
        username,
        url: url,
        createdAt: new Date()
    };
}
module.exports = {
    generateMessage,
    generateLocationMessage
};