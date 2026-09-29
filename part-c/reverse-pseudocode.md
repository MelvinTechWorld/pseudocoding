# Part C2: Reverse-Engineered Pseudocode

FUNCTION aiApplyDiscountCode
INPUTS: customerId (String), orderTotalCents (Number), codeString (String), currentTimestamp (Number), db (DatabaseMock)
OUTPUT: Record containing finalTotalCents, discountAppliedCents, and code
SIDE EFFECTS: WRITES redemption record to database, WRITES to standard output (console.warn)
FAILS WHEN: orderTotal <= 0, code not found, code expired, minimum spend not met, or already redeemed.

1. IF orderTotalCents <= 0 RETURN "INVALID_ORDER_TOTAL..."
2. CALL db.findDiscountByCode
3. IF discount is null RETURN "CODE_NOT_FOUND..."
4. IF currentTimestamp > discount.expiresAt
     WRITE warning to console
     RETURN "CODE_EXPIRED..."
5. IF orderTotalCents < discount.minSpendCents RETURN "MIN_SPEND_NOT_MET..."
6. CALL db.findRedemption
7. IF existingRedemption is not null RETURN "ALREADY_REDEEMED..."
8. IF discount.type == "percentage"
     Set calculatedDiscount to floor(orderTotalCents * discount.value / 100)
   OTHERWISE IF discount.type == "fixed"
     Set calculatedDiscount to discount.value
   OTHERWISE
     RETURN "INVALID_DISCOUNT_TYPE..."
9. Set finalTotalCents to orderTotalCents - calculatedDiscount
10. CALL db.insertRedemption
11. RETURN finalTotalCents, calculatedDiscount, discount.code