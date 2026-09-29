# Part B2: Trace vs. Test Execution Comparison

This document records the side-by-side comparison between the hand-traced predictions in `discount-spec.md` and the actual runtime output of `discount.ts`.

| Input Scenario | Predicted Output (Hand Trace) | Actual Runtime Execution | Verdict |
| :--- | :--- | :--- | :--- |
| **Trace 1: Normal Valid** (`SAVE20`, $100 order) | `{ finalTotalCents: 8000, discountAppliedCents: 2000, code: "SAVE20" }` | `{ finalTotalCents: 8000, discountAppliedCents: 2000, code: "SAVE20" }` | **MATCH** |
| **Trace 2: Expired Code** (`currentTimestamp > expiresAt`) | Throws `CODE_EXPIRED: Discount code has expired` | Throws `CODE_EXPIRED: Discount code has expired` | **MATCH** |
| **Trace 3: Used Twice** (`cust_1` already redeemed) | Throws `ALREADY_REDEEMED: Discount code has already been used by this customer` | Throws `ALREADY_REDEEMED: Discount code has already been used by this customer` | **MATCH** |
| **Trace 4: Under Minimum Spend** ($49.99 < $50 min spend) | Throws `MIN_SPEND_NOT_MET: Order does not meet minimum qualifying spend` | Throws `MIN_SPEND_NOT_MET: Order does not meet minimum qualifying spend` | **MATCH** |
| **Trace 5: Invalid Total** (Negative total `-2500`) | Throws `INVALID_ORDER_TOTAL: Order total must be greater than zero` | Throws `INVALID_ORDER_TOTAL: Order total must be greater than zero` | **MATCH** |

### Analysis
* Every single branch, early exit, and mathematical calculation yielded identical results between the manual trace and the compiled TypeScript execution.
* The 1-to-1 mapping between pseudocode steps and TypeScript statements ensured that edge cases (like clamp logic and date comparisons) behaved without discrepancy.