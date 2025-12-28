import { Router } from 'express';
import { MOCK_CONTROLS, getMockKpis } from '../services/mockData';

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
        search
    } = req.query;

    let filtered = [...MOCK_CONTROLS];

    // Apply same filters as controls to get context-aware KPIs
    if (businessUnit) filtered = filtered.filter(c => c.BusinessUnit === businessUnit);
    if (processName) filtered = filtered.filter(c => c.ProcessName?.toLowerCase().includes(String(processName).toLowerCase()));
    if (processId) filtered = filtered.filter(c => c.ProcessId?.toLowerCase().includes(String(processId).toLowerCase()));
    if (controlOwner) filtered = filtered.filter(c => c.ControlOwner?.toLowerCase().includes(String(controlOwner).toLowerCase()));
    if (testPerformer) filtered = filtered.filter(c => c.TestPerformer?.toLowerCase().includes(String(testPerformer).toLowerCase()));
    if (quarter) filtered = filtered.filter(c => c.Quarter === quarter);
    if (status) filtered = filtered.filter(c => c.Status === status);
    if (assertionStatus) filtered = filtered.filter(c => c.AssertionStatus === assertionStatus);

    if (search) {
        const s = String(search).toLowerCase();
        filtered = filtered.filter(c =>
            c.ControlId.toLowerCase().includes(s) ||
            c.ControlTitle.toLowerCase().includes(s)
        );
    }

    const kpis = getMockKpis(filtered);
    res.json(kpis);
});

export default router;
