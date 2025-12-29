export interface ControlRow {
    ControlId: string;
    BusinessUnit: string;
    ProcessName: string;
    ProcessId: string;
    ControlOwner: string;
    TestPerformer: string;
    ControlTitle: string;
    ControlDescription: string;
    TestTitle: string;
    TestProcedure: string;
    Quarter: 'Q1' | 'Q2' | 'Q3' | 'Q4';
    DueDate: string;
    Status: 'Pending' | 'Completed' | 'Not Rated' | 'Fail'; // Test Status
    AssertionStatus: 'Due' | 'Asserted' | 'Not Asserted'; // Certification Status
    Effectiveness: 'Effective' | 'Not Effective';
    CertificationDueDate: string;
    ORELink?: string;
    ORE_Number?: string;
    ORE_Title?: string;
    ORE_Owner?: string;
}

export interface KpiData {
    certificationDue: number;
    controlNotAsserted: number;
    controlAsserted: number;
    testPending: number;
    passTest: number;
    notRatedTest: number;
    failTest: number;
    controlEffective: number;
    controlNotEffective: number;
}

export interface CalendarEvent {
    id: string;
    title: string;
    date: string;
    status: string;
    type: 'DueDate' | 'Custom';
    description?: string;
    owner?: string;
    businessUnit?: string;
    ORE_Number?: string;
    AssertionStatus?: 'Due' | 'Asserted' | 'Not Asserted';
}

export interface ControlsResponse {
    items: ControlRow[];
    total: number;
    page: number;
    pageSize: number;
}

export interface CalendarResponse {
    items: CalendarEvent[];
}
