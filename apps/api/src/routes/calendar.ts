import { Router } from 'express';
import { MOCK_CONTROLS, getMockCalendarEvents } from '../services/mockData';

const router = Router();

router.get('/', (req, res) => {
    // Calendar might support start/end date filtering, but for mock we can dump all
    // or simple filtering.
    const { start, end } = req.query;

    // Ideally filter by date range. 
    // For mock MVP, we'll return all events derived from controls.
    const events = getMockCalendarEvents(MOCK_CONTROLS);

    // Filter by date if present
    let filtered = events;
    if (start && end) {
        filtered = events.filter(e => e.date >= String(start) && e.date <= String(end));
    }

    res.json({ items: filtered });
});

export default router;
