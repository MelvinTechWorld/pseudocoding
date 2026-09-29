# Part A3.2: Planted Bug - Identification

By comparing the "Actual" pseudocode against the "Intended" pseudocode, the bug is isolated entirely in Step 1.

* **The Root Cause:** A flipped comparison operator in the expiry check (`> ` instead of `< `).
* **The Resulting Behavior:** The function currently throws an expiration error for *valid* (future) discount codes, and successfully applies *expired* (past) discount codes.