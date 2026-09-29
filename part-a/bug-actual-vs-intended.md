# Part A3.1: Planted Bug - Actual vs. Intended Pseudocode

## The Buggy Source Code (Provided by partner)
```javascript
function applyDiscount(cartTotal, discountRecord) {
  if (discountRecord.expiryDate > Date.now()) {
    throw new Error("Discount code has expired");
  }
  
  let finalTotal = cartTotal - discountRecord.amount;
  if (finalTotal < 0) {
    finalTotal = 0;
  }
  
  return finalTotal;
}