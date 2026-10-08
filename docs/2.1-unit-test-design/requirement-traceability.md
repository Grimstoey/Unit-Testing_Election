# Requirements Traceability — Create Political Party

Source: supplied `Feature.docx`, UC-EC-01, FR-01–FR-12, BR-01–BR-05, legacy `TC-CP-001`–`TC-CP-013`.

| Requirement | Legacy API case(s) | Proposed unit case(s) |
|---|---|---|
| FR-01 Create party for EC | TC-CP-001 | UT-CP-001, 018 |
| FR-02 Authenticated user only | TC-CP-006, 007 | UT-CP-009, 010 |
| FR-03 EC role only | TC-CP-008 | UT-CP-011 |
| FR-04 Receive party fields | TC-CP-001–004 | UT-CP-001–004 |
| FR-05 No duplicate names | TC-CP-005 | UT-CP-013 |
| FR-06 Persist party | TC-CP-001 | UT-CP-001, 015, 017 |
| FR-07 Creator and creation timestamp | TC-CP-009 | UT-CP-012, 017 |
| FR-08 Respond on success | TC-CP-001 | UT-CP-001, 015 |
| FR-09 Respond on failure | TC-CP-002–008, 010–013 | UT-CP-002–014 |
| FR-10 Trim surrounding whitespace | TC-CP-010, 011, 013 | UT-CP-005, 006, 008 |
| FR-11 Reject null, empty, whitespace-only | TC-CP-010–013 | UT-CP-002–008 |
| FR-12 Require name, logo and policy | TC-CP-002–004, 010–013 | UT-CP-002–007 |

**Important:** The relationship is a *design mapping*, not proof of coverage. Coverage is earned only after the corresponding automated test exists and runs. The legacy API cases and new unit cases are different levels of testing.
