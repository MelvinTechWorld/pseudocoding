# Part C3: Two-Implementation Comparison on 10 Inputs

We ran both `applyDiscountCode` (Human/Part B) and `aiApplyDiscountCode` (AI/Part C) against 10 inputs to find where they diverge.

| Input Scenario | Human Implementation (Part B) | AI Implementation (Part C) | Match? |
| :--- | :--- | :--- | :--- |
| 1. Normal Percentage | 8000 cents | 8000 cents | YES |
| 2. Expired Code | Throws `CODE_EXPIRED` | Throws `CODE_EXPIRED` (and logs warning) | YES |
| 3. Used Twice | Throws `ALREADY_REDEEMED` | Throws `ALREADY_REDEEMED` | YES |
| 4. Under Min Spend | Throws `MIN_SPEND_NOT_MET` | Throws `MIN_SPEND_NOT_MET` | YES |
| 5. Negative Total | Throws `INVALID_ORDER_TOTAL`| Throws `INVALID_ORDER_TOTAL`| YES |
| 6. Fixed Discount > Total | **Returns 0 cents (Clamped)** | **Returns -1500 cents (Negative)** | **NO** |
| 7. Exact Min Spend | Applies discount | Applies discount | YES |
| 8. Fixed Discount < Total | Applies fixed discount | Applies fixed discount | YES |
| 9. Unknown Discount Type | Throws `INVALID_DISCOUNT_TYPE` | Throws `INVALID_DISCOUNT_TYPE` | YES |
| 10. Code Does Not Exist | Throws `CODE_NOT_FOUND` | Throws `CODE_NOT_FOUND` | YES |

### Resolution of Disagreement
On **Input 6**, a $25 order was placed using a $40 fixed discount code. 
* **Who was right:** The Human implementation (Part B) was right. 
* **Why:** By tracing the original B1 pseudocode, Step 9 explicitly states: `IF calculatedDiscount is greater than orderTotalCents, set actualDiscount to orderTotalCents`. The AI omitted this step, allowing the order total to drop into negative numbers (owing the customer money).