# Part B1: Discount Code Feature Specification & Hand Traces

## Feature Rules
1. Order total must be greater than zero.
2. Discount code must exist in the database/store.
3. Discount code must not be expired.
4. Order total must meet or exceed the discount code's minimum spend threshold.
5. Customer must not have previously redeemed this discount code (one use per customer).
6. Discounter type can be `percentage` (e.g., 20% off) or `fixed` (e.g., $10 off in minor units).
7. Discounted total can never drop below zero.
8. State change: Once applied, record redemption against the customer's account.

---

## Standard Pseudocode

```text
FUNCTION applyDiscountCode
INPUTS: 
  customerId (String, unique customer identifier),
  orderTotalCents (Integer, pre-discount subtotal in minor currency units),
  codeString (String, raw coupon text submitted by user),
  currentTimestamp (Integer, unix epoch seconds representing time of evaluation)
OUTPUT: 
  discountResult (Record containing finalTotalCents: Integer, discountAppliedCents: Integer, code: String)
SIDE EFFECTS: 
  WRITE to redemptions table recording (customerId, discountCodeId, redeemedAt)
FAILS WHEN: 
  orderTotalCents <= 0,
  codeString is not found,
  currentTimestamp > code.expiresAt,
  orderTotalCents < code.minSpendCents,
  customer has an existing record in redemptions table for this code

1. IF orderTotalCents is less than or equal to 0
     RETURN error: "INVALID_ORDER_TOTAL: Order total must be greater than zero"
   OTHERWISE
     continue
2. CALL database to look up discount record matching codeString (may fail, may be slow)
3. IF discount record is not found
     RETURN error: "CODE_NOT_FOUND: Provided discount code does not exist"
   OTHERWISE
     continue
4. IF currentTimestamp is strictly greater than discount record.expiresAt
     RETURN error: "CODE_EXPIRED: Discount code has expired"
   OTHERWISE
     continue
5. IF orderTotalCents is strictly less than discount record.minSpendCents
     RETURN error: "MIN_SPEND_NOT_MET: Order does not meet minimum qualifying spend"
   OTHERWISE
     continue
6. CALL database to check if a redemption row exists for customerId and discount record.id
7. IF redemption row exists
     RETURN error: "ALREADY_REDEEMED: Discount code has already been used by this customer"
   OTHERWISE
     continue
8. IF discount record.type is EQUAL to "percentage"
     Calculate calculatedDiscount as integer division of (orderTotalCents multiplied by discount record.value) by 100
   OTHERWISE IF discount record.type is EQUAL to "fixed"
     Set calculatedDiscount to discount record.value
   OTHERWISE
     RETURN error: "INVALID_DISCOUNT_TYPE: Unknown discount type configuration"
9. IF calculatedDiscount is greater than orderTotalCents
     Set actualDiscount to orderTotalCents
   OTHERWISE
     Set actualDiscount to calculatedDiscount
10. Calculate finalTotalCents as orderTotalCents minus actualDiscount
11. WRITE redemption row to database with customerId, discount record.id, and currentTimestamp
12. RETURN record containing:
      finalTotalCents as finalTotalCents,
      discountAppliedCents as actualDiscount,
      code as discount record.code