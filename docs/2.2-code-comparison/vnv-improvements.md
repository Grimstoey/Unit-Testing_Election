# V&V Improvement Register

## Confirmed baseline gaps
1. No executable `npm test` task in `main`.
2. `createPartyService` in `main` does not trim or validate party fields before passing them to Prisma.
3. The create controller gets authenticated user data from `req.body.user`, which is populated by `requireAuth`. This arrangement should be tested for preservation of 401 and 403 decisions.
4. `PrismaErrorHandler` handles known Prisma failures (e.g. P2002 => 409); adding input validation must preserve these responses.

## Planned improvements and verification
| Candidate change | Rationale | Planned verification | State |
|---|---|---|---|
| Extract or add validation for required party fields and normalization | FR-10, FR-11, FR-12 | UT-CP-002–008 | Proposed |
| Introduce isolated test doubles for persistence | Unit tests should not touch live DB | UT-CP-015–017 | Proposed |
| Add a test runner and Faker dependency | Homework requirement 2.3 | UT-CP-018 | Proposed |
| Ensure rejected inputs do not invoke persistence | Prevent invalid writes | UT-CP-007, 016 | Proposed |
| Report safe errors on unexpected persistence failures | FR-09, security | UT-CP-014 | Proposed |

**Do not label proposed changes completed until verified in code.** Final analysis will include file-by-file diff against `main`, exact commands, and test evidence.
