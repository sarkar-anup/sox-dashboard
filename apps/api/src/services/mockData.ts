import { ControlRow } from '../types/control';
import { KpiData } from '../types/kpi';
import { CalendarEvent } from '../types/calendar';

const REALISTIC_CONTROLS = [
    { title: 'User Access Review - Active Directory', desc: 'Quarterly review of all active directory accounts to ensure access levels are appropriate.', bu: 'IT', proc: 'Access Management' },
    { title: 'Weekly Inventory Reconciliation', desc: 'Reconciliation of physical inventory counts to GL balance every Friday.', bu: 'Operations', proc: 'Inventory Management' },
    { title: 'Payroll Variation Analysis', desc: 'Review of payroll variance reports >$5k prior to disbursement.', bu: 'HR', proc: 'Payroll Processing' },
    { title: 'Vendor Master File Review', desc: 'Periodic review of changes to vendor master data including bank details.', bu: 'Finance', proc: 'Procurement' },
    { title: 'Change Management Authorization', desc: 'Verification that all production code changes have CAB approval.', bu: 'IT', proc: 'Change Management' },
    { title: 'Bank Reconciliation Approval', desc: 'Monthly review and sign-off of bank reconciliations by Controller.', bu: 'Finance', proc: 'Treasury' },
    { title: 'Physical Security Check', desc: 'Daily log review of badge access to sensitive server rooms.', bu: 'Operations', proc: 'Physical Security' },
    { title: 'Employee Termination Access Removal', desc: 'Validation that access is revoked within 24 hours of separation.', bu: 'HR', proc: 'Access Management' }
];

const generateControls = (count: number): ControlRow[] => {
    const owners = ['Band 30', 'Band 35', 'Band 40', 'Band 45', 'Band 50'];
    const statuses: ControlRow['Status'][] = ['Pending', 'Completed', 'Not Rated', 'Fail'];
    const assertionStatuses: ControlRow['AssertionStatus'][] = ['Due', 'Asserted', 'Not Asserted'];
    const quarters: ControlRow['Quarter'][] = ['Q1', 'Q2', 'Q3', 'Q4'];
    const effectiveness: ControlRow['Effectiveness'][] = ['Effective', 'Not Effective'];

    return Array.from({ length: count }).map((_, i) => {
        const template = REALISTIC_CONTROLS[i % REALISTIC_CONTROLS.length];
        const status = statuses[i % statuses.length];
        const assertionStatus = assertionStatuses[i % assertionStatuses.length];

        // Randomize Date within 2025
        const month = Math.floor(Math.random() * 12); // 0-11
        const day = Math.floor(Math.random() * 28) + 1; // 1-28 (safe)

        // Derive Quarter from Month
        // Jan-Mar(0-2)=Q1, Apr-Jun(3-5)=Q2, Jul-Sep(6-8)=Q3, Oct-Dec(9-11)=Q4
        const qIndex = Math.floor(month / 3);
        const quarter = quarters[qIndex];

        // Format Dates
        const dueDate = new Date(2025, month, day);
        // Correlate effectiveness with status for realism
        const eff = status === 'Completed' ? (Math.random() > 0.1 ? 'Effective' : 'Not Effective') : 'Not Effective';

        // Date Generation Logic aligned with Quarter
        // Assuming FY2025
        const year = 2025;
        let targetDate = new Date();

        // Randomly pick a quarter if not provided (though code above picks one)
        const q = quarters[Math.floor(Math.random() * quarters.length)];

        if (q === 'Q1') {
            // Jan - Mar
            targetDate = new Date(year, 0, 15); // Jan 15
        } else if (q === 'Q2') {
            // Apr - Jun
            targetDate = new Date(year, 3, 15); // Apr 15
        } else if (q === 'Q3') {
            // Jul - Sep
            targetDate = new Date(year, 6, 15); // Jul 15
        } else {
            // Q4: Oct - Dec
            // We want some variation here to test Red/Amber/Green logic for "Due Dates"
            // relative to "Today" (Dec 27, 2025 or similar).
            // Let's vary from Dec 15 to Jan 30 (crossing year boundary for future dates)
            const baseDate = new Date(year, 11, 27); // Dec 27, 2025
            const randomOffset = Math.floor(Math.random() * 40) - 20; // -20 to +19 days, centered around 0
            targetDate = new Date(baseDate);
            targetDate.setDate(baseDate.getDate() + randomOffset);
        }

        const dateStr = targetDate.toISOString().split('T')[0];

        return {
            ControlId: `CTL-${1000 + i}`,
            BusinessUnit: template.bu,
            ProcessName: template.proc,
            ProcessId: `PROC-${100 + i}`,
            ControlTitle: template.title,
            ControlDescription: template.desc,
            TestTitle: `Test of ${template.title}`,
            TestProcedure: `Verify evidence for ${template.title} in accordance with policy...`,
            ControlOwner: owners[i % owners.length],
            TestPerformer: owners[(i + 1) % owners.length],
            Quarter: q,
            DueDate: dateStr,
            Status: status,
            AssertionStatus: assertionStatus,
            Effectiveness: eff,
            CertificationDueDate: dateStr, // Use same date for cert due date
            ORE_Number: `ORE-2025-${(100 + i).toString().padStart(4, '0')}`,
            ORE_Title: `Operational Risk Event for ${template.title}`,
            ORE_Owner: owners[(i + 2) % owners.length]
        };
    });
};

export const MOCK_CONTROLS: ControlRow[] = generateControls(100);

export const getMockKpis = (controls: ControlRow[]): KpiData => {
    // ... existing logic ...
    const kpis: KpiData = {
        certificationDue: 0,
        controlNotAsserted: 0,
        controlAsserted: 0,
        testPending: 0,
        passTest: 0,
        notRatedTest: 0,
        failTest: 0,
        controlEffective: 0,
        controlNotEffective: 0
    };

    controls.forEach(c => {
        if (c.AssertionStatus === 'Due') kpis.certificationDue++;
        if (c.AssertionStatus === 'Not Asserted') kpis.controlNotAsserted++;
        if (c.AssertionStatus === 'Asserted') kpis.controlAsserted++;

        if (c.Status === 'Pending') kpis.testPending++;
        if (c.Status === 'Completed') kpis.passTest++;
        if (c.Status === 'Not Rated') kpis.notRatedTest++;
        if (c.Status === 'Fail') kpis.failTest++;

        if (c.Effectiveness === 'Effective') kpis.controlEffective++;
        else kpis.controlNotEffective++;
    });
    return kpis;
};

export const getMockCalendarEvents = (controls: ControlRow[]): CalendarEvent[] => {
    return controls.map(c => ({
        id: c.ControlId,
        title: c.ControlTitle,
        date: c.DueDate,
        status: c.Status,
        type: 'DueDate',
        description: c.ControlDescription,
        owner: c.ControlOwner,
        businessUnit: c.BusinessUnit,
        // Added ORE fields mapping
        ORE_Number: c.ORE_Number,
        AssertionStatus: c.AssertionStatus
    }));
};
