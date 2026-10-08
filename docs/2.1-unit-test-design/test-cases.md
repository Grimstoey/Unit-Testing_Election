# Unit Test Case Catalog (design stage)

**Status:** Planned, not yet executed. Case IDs prefixed `UT-CP-` are new unit-level cases and do not overwrite the original Postman `TC-CP-` IDs.

| Test ID | Behavior / expected outcome | Category | Traceability |
|---|---|---|---|
| UT-CP-001 | Valid fields and EC user → creation succeeds with normalized fields | Happy path | FR-01, 04, 06, 08 |
| UT-CP-002 | Missing name → reject before repository call | Failure | FR-11, 12; TC-CP-002 |
| UT-CP-003 | Missing logoUrl → reject before repository call | Failure | FR-12; TC-CP-003 |
| UT-CP-004 | Missing policy → reject before repository call | Failure | FR-12; TC-CP-004 |
| UT-CP-005 | Whitespace-only name → reject | BVA/EP | FR-10, 11; TC-CP-011 |
| UT-CP-006 | Whitespace-only policy → reject | BVA/EP | FR-10, 11; TC-CP-013 |
| UT-CP-007 | Null / empty fields → reject; no DB writes | EP + negative interaction | FR-11; TC-CP-010, 012 |
| UT-CP-008 | Surrounding whitespace is trimmed for name and policy | Normalization | FR-10 |
| UT-CP-009 | No auth credentials → 401, service not invoked | Auth | FR-02; TC-CP-006 |
| UT-CP-010 | Invalid token → 401 | Auth | FR-02; TC-CP-007 |
| UT-CP-011 | Authenticated non-EC → 403; controller not invoked | Authorization | FR-03; TC-CP-008 |
| UT-CP-012 | Repository receives correct user ID in createdBy/updatedBy | Mock interaction | FR-07; TC-CP-009 |
| UT-CP-013 | Unique name conflict → application reports 409 | Failure | FR-05; TC-CP-005 |
| UT-CP-014 | Unexpected persistence error → safe server failure, no internal details exposed | Failure | FR-09 |
| UT-CP-015 | Repository stub returns created entity; service maps to successful response | Stub | FR-06, 08 |
| UT-CP-016 | Spy verifies call count and arguments; no call for invalid data | Spy | FR-11 |
| UT-CP-017 | Mock Prisma create and verify payload; no actual database | Mock | FR-06, 07 |
| UT-CP-018 | Faker generates unique valid party names across independent tests | Dynamic data | FR-01, 04 |

### Test quality notes
- `FR-05` is enforced in Prisma schema by `party.name @unique`; the expected 409 comes from Prisma's P2002 error handler. Unit test the mapping rather than running a real DB.
- Avoid assuming a maximum allowed name or policy length: the supplied requirements do not define one.
- Current error handler exposes Prisma diagnostic metadata outside production. Do not include real database credentials, token values or personally identifying seed data in test artifacts.
- Real-world test naming, file references and results should be updated after implementation.
