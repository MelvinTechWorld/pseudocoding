# Task 5: Pseudocoding Standard and AI Specification Gap

## The Pseudocode Standard
This repository adheres strictly to a mandatory pseudocode format designed to remove ambiguity and test logical comprehension independently of code syntax. Every pseudocode block follows these rules:
1. **Header:** Explicitly defines `FUNCTION` name, `INPUTS` (with types), `OUTPUT`, `SIDE EFFECTS`, and `FAILS WHEN` conditions.
2. **Execution:** Numbered, plain-English steps in the present tense.
3. **Control Flow:** Explicit `IF/OTHERWISE` branches and `FOR EACH` loops defining exact iteration boundaries.
4. **Mutations & I/O:** All state changes are marked with `WRITE`, and all external boundaries are marked with `CALL`.

## The Specification Gap (What I Learned)
In Part C, I provided my exact pseudocode specification for a discount code feature to an AI agent to implement, and then reverse-engineered its output. This exposed critical gaps between human intent and AI execution:
* **Unprompted Additions:** The AI added side effects (like `console.warn` logging for expired codes) that were never requested in the spec.
* **Dangerous Omissions:** The AI completely missed Step 9 of my specification, which clamped the maximum discount to the order total. This resulted in a bug where fixed discounts could drive an order total into negative numbers.
* **Ambiguity:** I specified "integer division" in my math step. The AI interpreted this as JavaScript's `Math.floor()`. A stricter specification would have dictated exactly how to round the value.

**Conclusion:** Pseudocode is the most effective way to direct an AI, but the AI cannot be trusted to follow it verbatim. The engineer's primary job is verifying the output against the original strict specification.