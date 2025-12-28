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
    DueDate: string; // ISO Date
    Status: 'Pending' | 'Completed' | 'Not Rated' | 'Fail'; // Represents Test Status
    AssertionStatus: 'Due' | 'Asserted' | 'Not Asserted'; // New Certification Status
    Effectiveness: 'Effective' | 'Not Effective';
    CertificationDueDate: string; // ISO Date
    ORELink?: string;
    ORE_Number?: string;
    ORE_Title?: string;
    ORE_Owner?: string;
}

export interface ControlsResponse {
    items: ControlRow[];
    total: number;
    page: number;
    pageSize: number;
}
