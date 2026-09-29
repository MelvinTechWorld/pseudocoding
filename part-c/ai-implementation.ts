import { DiscountRecord, RedemptionRecord, DiscountResult, DatabaseMock } from '../part-b/discount';

export async function aiApplyDiscountCode(
    customerId: string,
    orderTotalCents: number,
    codeString: string,
    currentTimestamp: number,
    db: DatabaseMock
): Promise<DiscountResult> {
    if (orderTotalCents <= 0) {
        throw new Error("INVALID_ORDER_TOTAL: Order total must be greater than zero");
    }

    const discount = await db.findDiscountByCode(codeString);
    if (!discount) {
        throw new Error("CODE_NOT_FOUND: Provided discount code does not exist");
    }

    if (currentTimestamp > discount.expiresAt) {
        // AI ADDED THIS LOGGING UNPROMPTED
        console.warn(`User ${customerId} attempted to use expired code ${codeString}`);
        throw new Error("CODE_EXPIRED: Discount code has expired");
    }

    if (orderTotalCents < discount.minSpendCents) {
        throw new Error("MIN_SPEND_NOT_MET: Order does not meet minimum qualifying spend");
    }

    const existingRedemption = await db.findRedemption(customerId, discount.id);
    if (existingRedemption) {
        throw new Error("ALREADY_REDEEMED: Discount code has already been used by this customer");
    }

    let calculatedDiscount = 0;
    if (discount.type === "percentage") {
        calculatedDiscount = Math.floor((orderTotalCents * discount.value) / 100);
    } else if (discount.type === "fixed") {
        calculatedDiscount = discount.value;
    } else {
        throw new Error("INVALID_DISCOUNT_TYPE: Unknown discount type configuration");
    }

    // AI OMITTED STEP 9 ENTIRELY (The clamp preventing negative totals)

    const finalTotalCents = orderTotalCents - calculatedDiscount;

    await db.insertRedemption({
        customerId,
        discountId: discount.id,
        redeemedAt: currentTimestamp,
    });

    return {
        finalTotalCents,
        discountAppliedCents: calculatedDiscount,
        code: discount.code,
    };
}