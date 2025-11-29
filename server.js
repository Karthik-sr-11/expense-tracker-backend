require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const authRoutes = require('./routes/authroutes');
const transactionRoutes = require('./routes/transactionroutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to database
connectDB();

// CORS – allow ALL (important for Netlify + Render)

app.use(cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: "Content-Type, Authorization"
}));


// Body parser
app.use(express.json());
app.use(express.urlencoded({ extened:true}));
// Routes
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);

// Healthcheck
app.get('/api', (req, res) => {
    res.json({ message: "API is running 🚀" });
});

// Root message (optional)
app.get('/', (req, res) => {
    res.send("Expense Tracker API is running...");
});

// Start server
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});







