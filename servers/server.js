const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const port = process.env.PORT;

const app = express();

const db = require('./models');
const userRouter = require('./routes/usersRouter');
const authRouter = require('./routes/authRouter');
const cookieParser = require('cookie-parser');

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
}));

app.use(express.json());
app.use(cookieParser());


app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);

const startServer = async () => {
    try {
        await db.sequelize.authenticate();
        console.log("✅ Database connected!");

        await db.sequelize.sync({ alter: false });
        console.log("✅ Models synced!");

        app.listen(port, () => {
            console.log(`🚀 Server is running at http://localhost:${port}`);
        });
    } catch (error) {
        console.error("❌ Cannot connect to DB:", error);
        process.exit(1);
    }
};

startServer();

