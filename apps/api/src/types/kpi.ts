export interface KpiData {
    certificationDue: number;
    controlNotAsserted: number;
    controlAsserted: number; // New field
    testPending: number;
    passTest: number;
    notRatedTest: number;
    failTest: number;
    controlEffective: number;
    controlNotEffective: number;
}
