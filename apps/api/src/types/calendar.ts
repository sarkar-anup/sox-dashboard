export interface CalendarEvent {
    id: string;
    title: string;
    date: string; // YYYY-MM-DD
    status: string; // e.g. Pending, Completed, Fail
    type: 'DueDate' | 'Custom';
    description?: string;
    owner?: string;
    businessUnit?: string;
}

export interface CalendarResponse {
    items: CalendarEvent[];
}
