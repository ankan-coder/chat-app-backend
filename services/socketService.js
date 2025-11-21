const Message = require('../models/Message');
const Room = require('../models/Room');
const DirectConversation = require('../models/DirectConversation');
const DirectMessage = require('../models/DirectMessage');
const {
    addOnlineUser,
    removeOnlineUser,
    getOnlineUsers
} = require('./presenceService');

const initializeSocket = (io) => {
    io.use(async (socket, next) => {
        try {
            const userId = socket.handshake.auth.userId;
            if (!userId) {
                return next(new Error('Authentication error'));
            }
            socket.userId = userId;
            next();
        } catch (error) {
            console.error('Socket authentication error:', {
                timestamp: new Date().toISOString(),
                error: error.message,
                stack: error.stack
            });
            next(new Error('Authentication error'));
        }
    });

    io.on('connection', (socket) => {
        console.log(`User connected: ${socket.userId}`);
        socket.join(`user:${socket.userId}`);
        addOnlineUser(socket.userId);
        socket.emit('presence-sync', getOnlineUsers());
        io.emit('presence-update', { userId: socket.userId, status: 'online' });

        socket.on('error', (error) => {
            console.error('Socket error:', {
                timestamp: new Date().toISOString(),
                userId: socket.userId,
                error: error.message,
                stack: error.stack
            });
        });

        socket.on('join-room', async (roomId) => {
            try {
                socket.join(roomId);
                const room = await Room.findById(roomId);
                if (room && !room.participants.includes(socket.userId)) {
                    room.participants.push(socket.userId);
                    await room.save();
                }
                socket.emit('joined-room', roomId);
            } catch (error) {
                console.error('Error joining room:', {
                    timestamp: new Date().toISOString(),
                    userId: socket.userId,
                    roomId,
                    error: error.message,
                    stack: error.stack
                });
                socket.emit('error', { message: 'Failed to join room' });
            }
        });

        socket.on('send-message', async (data) => {
            try {
                const { text, roomId } = data;

                const message = new Message({
                    text,
                    userId: socket.userId,
                    roomId,
                    type: 'user'
                });

                await message.save();
                await message.populate('userId', 'username');

                io.to(roomId).emit('new-message', message);
            } catch (error) {
                console.error('Error sending message:', {
                    timestamp: new Date().toISOString(),
                    userId: socket.userId,
                    data,
                    error: error.message,
                    stack: error.stack
                });
                socket.emit('error', { message: 'Failed to send message' });
            }
        });

        socket.on('typing', (data) => {
            socket.to(data.roomId).emit('user-typing', {
                userId: socket.userId,
                roomId: data.roomId
            });
        });

        socket.on('stop-typing', (data) => {
            socket.to(data.roomId).emit('user-stopped-typing', {
                userId: socket.userId,
                roomId: data.roomId
            });
        });

        socket.on('join-direct', async ({ conversationId }) => {
            try {
                const conversation = await DirectConversation.findById(conversationId);
                if (!conversation) {
                    return socket.emit('error', { message: 'Conversation not found' });
                }

                const isParticipant = conversation.participants
                    .some(participantId => participantId.toString() === socket.userId.toString());

                if (!isParticipant) {
                    return socket.emit('error', { message: 'Not authorized to join this conversation' });
                }

                socket.join(`dm:${conversationId}`);
                socket.emit('joined-direct', conversationId);
            } catch (error) {
                console.error('Error joining direct conversation:', {
                    timestamp: new Date().toISOString(),
                    userId: socket.userId,
                    conversationId,
                    error: error.message,
                    stack: error.stack
                });
                socket.emit('error', { message: 'Failed to join conversation' });
            }
        });

        socket.on('leave-direct', ({ conversationId }) => {
            if (!conversationId) return;
            socket.leave(`dm:${conversationId}`);
        });

        socket.on('send-direct-message', async ({ conversationId, text }) => {
            try {
                if (!text) {
                    return socket.emit('error', { message: 'Message text is required' });
                }

                const conversation = await DirectConversation.findById(conversationId);
                if (!conversation) {
                    return socket.emit('error', { message: 'Conversation not found' });
                }

                const isParticipant = conversation.participants
                    .some(participantId => participantId.toString() === socket.userId.toString());

                if (!isParticipant) {
                    return socket.emit('error', { message: 'Not authorized to send messages in this conversation' });
                }

                const recipientId = conversation.participants.find(
                    participantId => participantId.toString() !== socket.userId.toString()
                );

                const message = new DirectMessage({
                    conversation: conversationId,
                    sender: socket.userId,
                    recipient: recipientId,
                    text
                });

                await message.save();
                await message.populate('sender', 'username');

                conversation.lastMessage = message._id;
                await conversation.save();

                const payload = {
                    _id: message._id,
                    conversation: conversationId,
                    text: message.text,
                    sender: message.sender,
                    recipient: recipientId,
                    createdAt: message.createdAt
                };

                io.to(`dm:${conversationId}`).emit('direct-message', payload);
                conversation.participants.forEach(participantId => {
                    io.to(`user:${participantId}`).emit('direct-message-notification', {
                        conversationId,
                        message: payload
                    });
                });
            } catch (error) {
                console.error('Error sending direct message:', {
                    timestamp: new Date().toISOString(),
                    userId: socket.userId,
                    conversationId,
                    error: error.message,
                    stack: error.stack
                });
                socket.emit('error', { message: 'Failed to send direct message' });
            }
        });

        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.userId}`);
            removeOnlineUser(socket.userId);
            io.emit('presence-update', { userId: socket.userId, status: 'offline' });
        });
    });
};

module.exports = initializeSocket;

