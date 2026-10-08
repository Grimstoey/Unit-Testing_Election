# 2.1 Unit Test Design — Election System

## Scope and source of truth
Target feature: **Create Political Party**, UC-EC-01, `POST /ec/parties`.
Requirements are based on the supplied Feature.docx (FR-01–FR-12, BR-01–BR-05), the original TC-CP-001–013 specification workbook, and observed source code on `main`.

These legacy TC-CP cases were executed as API tests using Postman. They are **not** automatically unit tests. This assignment decomposes behavior into isolated units with controlled dependencies.

## Units and isolation boundaries
| Unit | Repository file | Dependency isolation | Objective |
|---|---|---|---|
| Input validation / normalization | Proposed pure function in `src/` | None | Reject missing, null, empty, whitespace-only values; trim name and policy |
| Party creation service | `src/services/PartyService.ts` | Stub/mock repository `createParty` | Return success or failure without actual database |
| Party persistence mapping | `src/repositories/PartyRepository.ts` | Mock Prisma client | Verify name, logoUrl, policy, createdBy and updatedBy |
| Create party controller | `src/controllers/PartyController.ts` | Stub service, spy on response | Verify request mapping and HTTP response |
| Authentication/role guard | `src/middlewares/AuthMiddleware.ts`, `RoleMiddleware.ts` | Stub authenticated user / spy on next | Verify 401 and 403 behavior |

The planned unit-level tests must not connect to a running PostgreSQL instance, invoke real S3, or require an HTTP server. Database integration and API tests are separate test levels.

## Test design techniques
- **Equivalence Partitioning:** valid nonempty input vs absent, null, empty-string, and whitespace-only partitions.
- **Boundary Value Analysis:** zero, one and multiple characters; check length boundaries only if the application explicitly defines limits.
- **Decision testing:** authenticated/unauthenticated; EC/non-EC; valid/invalid input; repository success/failure.
- **Risk-based prioritization:** prevent unauthorized writes, incorrect persistence, duplicate party names, and information disclosure.
- **Interaction verification:** check whether the repository was called with the correct data and **not called** on invalid input.

## Traceability starting point
| Requirement | Unit-level behavioral target | Previous API evidence |
|---|---|---|
| FR-01, FR-06, FR-08 | successful creation and response | TC-CP-001 |
| FR-02 | token missing/invalid | TC-CP-006, 007 |
| FR-03 | EC authorization | TC-CP-008 |
| FR-04, FR-12 | required fields | TC-CP-002, 003, 004, 010, 012 |
| FR-05 | duplicate name conflict | TC-CP-005 |
| FR-07 | audit fields | TC-CP-009 |
| FR-09 | rejection responses | TC-CP-002–008, 010–013 |
| FR-10, FR-11 | trim, empty and whitespace rejection | TC-CP-010, 011, 012, 013 |

## Acceptance criteria
1. Each automated test has one clear condition, expected outcome, and traceable requirement where applicable.
2. Positive, negative, Stub, Spy, Mock, and dynamically generated Faker data cases are implemented **and actually executed** before marking requirement 2.3 complete.
3. Test runs are reproducible from a fresh clone; report commands, framework version, run date, pass/fail/skip counts, and known limitations.
4. Never report a test as passed based only on source inspection.

See [planned cases](./test-cases.md).
