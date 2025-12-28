import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import healthRouter from './routes/health';
import controlsRouter from './routes/controls';
import kpisRouter from './routes/kpis';
import calendarRouter from './routes/calendar';
import adminRouter from './routes/admin';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/health', healthRouter);
app.use('/controls', controlsRouter);
app.use('/kpis', kpisRouter);
app.use('/calendar', calendarRouter);
app.use('/admin', adminRouter);

app.listen(PORT, () => {
    console.log(`API running on http://localhost:${PORT}`);
    console.log(`Mode: ${process.env.USE_MOCK_DATA === 'true' ? 'MOCK' : 'LIVE'}`);
});
