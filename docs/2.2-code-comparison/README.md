# 2.2 Code Comparison — Baseline and V&V branch

- **Original:** `main` (read-only baseline for the assignment).
- **Improved:** `vnv/election-unit-testing` (all assignment changes).
- Compare on GitHub using `main...vnv/election-unit-testing` or locally with `git diff main...vnv/election-unit-testing`.
- Do **not** merge into `main` as part of this assignment.

## Verified baseline observations from main
| Location | Behavior observed before change | Testing / V&V concern |
|---|---|---|
| `package.json` | `npm test` exits with 'no test specified' | No executable unit-test suite |
| `src/routes/ECRoutes.ts` | `POST /parties` protected by `requireAuth` and `requireRole(RoleName.EC)` | Preserve authentication/authorization behavior |
| `src/controllers/PartyController.ts` | Reads `name`, `logoUrl`, `policy` from body and `user.id`; calls service | Missing values are sent to service |
| `src/services/PartyService.ts` | Delegates create directly to repository and wraps result as success | No local validation or normalization |
| `src/repositories/PartyRepository.ts` | Prisma `party.create` mapping includes audit user ID | Dependency should be isolated for tests |
| `prisma/schema.prisma` | `party.name @unique`, required name/logoUrl/policy, audit timestamps | Keep database constraints while validating before persistence |
| `src/middlewares/PrismaErrorHandler.ts` | P2002 maps to 409, initialization errors map to 500 | Verify error mapping and absence of secrets |

## Comparison method
For each changed production file, document (1) unchanged behavior, (2) exact code differences with before/after references, (3) related requirement or defect, (4) test IDs that verify the change, (5) observed outcome and trade-offs.

**This file records baseline observations, not a claim that improvements or test execution have already completed.** Add final comparison evidence only after implementation.
