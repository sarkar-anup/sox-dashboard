# SharePoint Data Model

## List 1: ControlsInventory
System of record for all controls.

| Column Name | Type | Options / Notes |
|---|---|---|
| **ControlId** | Single line text | Unique Identifier (Key) |
| **BusinessUnit** | Choice | Finance, IT, HR, Operations |
| **ProcessName** | Single line text | Or Choice if fixed list |
| **ProcessId** | Single line text | |
| **ControlOwner** | Person | |
| **TestPerformer** | Person | |
| **ControlTitle** | Single line text | |
| **ControlDescription** | Multiple lines | |
| **TestTitle** | Single line text | |
| **TestProcedure** | Multiple lines | |
| **Quarter** | Choice | Q1, Q2, Q3, Q4 |
| **DueDate** | Date | |
| **Status** | Choice | Pending, Completed, Not Rated, Fail |
| **Effectiveness** | Choice | Effective, Not Effective |
| **CertificationDueDate** | Date | |
| **ORELink** | Hyperlink | Link to ORE evidence |

## List 2: Events (Optional)
If standard due dates are insufficient.

| Column Name | Type | Notes |
|---|---|---|
| **EventTitle** | Single line text | |
| **StartDate** | Date/Time | |
| **EndDate** | Date/Time | |
| **Type** | Choice | DueDate, Custom |
| **RelatedControlId** | Lookup | |
| **Notes** | Multiple lines | |
