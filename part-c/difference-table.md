# Part C2: Added, Omitted, and Ambiguous Spec Differences

By comparing the original B1 pseudocode against the C2 reverse-engineered pseudocode, the following discrepancies were identified:

| Pseudocode Step | Issue Type | Description |
| :--- | :--- | :--- |
| **Step 4 (Expiry)** | **Added** | The AI added a `console.warn` side-effect to log the user ID when an expired code is used. This was not in the specification. |
| **Step 9 (Clamp)** | **Omitted** | The AI completely missed Step 9 from the original pseudocode: `IF calculatedDiscount is greater than orderTotalCents...`. It failed to clamp the discount to the order total. |
| **Step 8 (Math)** | **Ambiguous Spec** | My original pseudocode said "integer division". The AI interpreted this as JavaScript's `Math.floor()`. A better, less ambiguous spec would have been: `Calculate calculatedDiscount as (orderTotalCents * value) / 100, rounded down to nearest integer`. |