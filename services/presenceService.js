const onlineUsers = new Set();

const normalizeId = (userId) => userId?.toString();

const addOnlineUser = (userId) => {
    const id = normalizeId(userId);
    if (id) {
        onlineUsers.add(id);
    }
};

const removeOnlineUser = (userId) => {
    const id = normalizeId(userId);
    if (id) {
        onlineUsers.delete(id);
    }
};

const isUserOnline = (userId) => {
    const id = normalizeId(userId);
    return id ? onlineUsers.has(id) : false;
};

const getOnlineUsers = () => Array.from(onlineUsers);

module.exports = {
    addOnlineUser,
    removeOnlineUser,
    isUserOnline,
    getOnlineUsers
};


