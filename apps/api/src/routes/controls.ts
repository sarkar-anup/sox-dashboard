import { Router } from 'express';
import { MOCK_CONTROLS } from '../services/mockData';

const router = Router();

router.get('/', (req, res) => {
    const {
        businessUnit,
        processName,
        processId,
        controlOwner,
        testPerformer,
        quarter,
        status,
        assertionStatus,
        search,
        page = '1',
        pageSize = '50'
    } = req.query;

    let filtered = [...MOCK_CONTROLS];

    // Apply filters - EXACT MATCH enforcement for dropdowns/specific fields
    // Apply filters - Mixed: Text fields (partial), Dropdowns (exact)
    if (businessUnit) filtered = filtered.filter(c => c.BusinessUnit === businessUnit);
    if (processName) filtered = filtered.filter(c => c.ProcessName?.toLowerCase().includes(String(processName).toLowerCase()));
    if (processId) filtered = filtered.filter(c => c.ProcessId?.toLowerCase().includes(String(processId).toLowerCase()));
    if (controlOwner) filtered = filtered.filter(c => c.ControlOwner?.toLowerCase().includes(String(controlOwner).toLowerCase()));
    if (testPerformer) filtered = filtered.filter(c => c.TestPerformer?.toLowerCase().includes(String(testPerformer).toLowerCase()));
    if (quarter) filtered = filtered.filter(c => c.Quarter === quarter);
    if (status) filtered = filtered.filter(c => c.Status === status);
    if (assertionStatus) filtered = filtered.filter(c => c.AssertionStatus === assertionStatus);

    // Partial match only for Global Search


    if (search) {
        const s = String(search).toLowerCase();
        filtered = filtered.filter(c =>
            c.ControlId.toLowerCase().includes(s) ||
            c.ControlTitle.toLowerCase().includes(s) ||
            c.ControlDescription.toLowerCase().includes(s)
        );
    }

    // Pagination
    const p = Number(page);
    const size = Number(pageSize);
    const start = (p - 1) * size;
    const paginated = filtered.slice(start, start + size);

    res.json({
        items: paginated,
        total: filtered.length,
        page: p,
        pageSize: size
    });
});

// GET /controls/:id - Get single control by ID
router.get('/:id', (req, res) => {
    const { id } = req.params;
    const control = MOCK_CONTROLS.find(c => c.ControlId === id);

    if (!control) {
        return res.status(404).json({ error: 'Control not found' });
    }

    res.json(control);
});

export default router;
