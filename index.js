const express = require('express');
const path = require('path');

const PORT = process.env.PORT || 3000;

const prisma = require('./prisma/prisma.js');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.get('/', (req, res) => {
    res.render('index.html');
});

io.on('connection', async (socket) => {
    console.log(`A user connected: ${socket.id}`);

    io.sockets.emit('attendances', await prisma.attendance.findMany());

    socket.on('new-attendance', async () => {
        await prisma.attendance.create({
            data: {
                preferential: false,
            }
        });

        const attendances_ = await prisma.attendance.findMany();

        io.sockets.emit('attendances', attendances_);
    });

    socket.on('new-preferential-attendance', async () => {
        await prisma.attendance.create({
            data: {
                preferential: true,
            }
        });

        const attendances_ = await prisma.attendance.findMany();

        io.sockets.emit('attendances', attendances_);
    });

    socket.on('next-attendance', async () => {
        const attendance_ = await prisma.attendance.findMany({
            where: {
                preferential: false,
            },
            orderBy: {
                id: 'desc',
            }
        });

        if (attendance_.length > 0) {
            io.sockets.emit('next-attendance', [attendance_[0]]);

            await prisma.attendance.delete({
                where: {
                    id: attendance_[0].id,
                }
            });

            io.sockets.emit('attendances', await prisma.attendance.findMany());
        } else {
            io.sockets.emit('next-attendance', []);
        }
    });

    socket.on('next-preferential-attendance', async () => {
        const attendance_ = await prisma.attendance.findMany({
            where: {
                preferential: true,
            },
            orderBy: {
                id: 'desc',
            }
        });

        if (attendance_.length > 0) {
            io.sockets.emit('next-preferential-attendance', [attendance_[0]]);
            
            await prisma.attendance.delete({
                where: {
                    id: attendance_[0].id,
                }
            });

            io.sockets.emit('attendances', await prisma.attendance.findMany());
        } else {
            io.sockets.emit('next-preferential-attendance', []);
        }
    });
});

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});