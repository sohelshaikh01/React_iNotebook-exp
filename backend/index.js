import express from 'express';
import connectToMongo from './db.js';
import authRouter from './routes/auth.js';
import notesRouter from './routes/notesAuth.js';

connectToMongo();
const app = express();
const port = import.meta.env || 5000;

app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/notes", notesRouter);

app.listen(port, () => {
    console.log(`Experiment app running successfully on http://localhost:${port}`);
});