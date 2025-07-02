import express from 'express';
import morgan from 'morgan';
import connect from './db/db.js';
import projectRoutes from './routes/project.route.js';
import userRoutes from './routes/user.routes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
connect(); // Connect to the database
const app = express();


app.use(cors());
app.use(cookieParser()); // Middleware to parse cookies
app.use(morgan('dev')); // Logging middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/users',userRoutes);
app.use('/projects', projectRoutes);

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

export default app; 