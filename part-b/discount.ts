export interface DiscountRecord {
    id: string;
    code: string;
    type: "percentage" | "fixed";
    value: number;
    minSpendCents: number;
    expiresAt: number;
}

export interface RedemptionRecord {
    customerId: string;
    discountId: string;
    redeemedAt: number;
}

export interface DiscountResult {
    finalTotalCents: number;
    discountAppliedCents: number;
    code: string;
}

export interface DatabaseMock {
    findDiscountByCode(code: string): Promise<DiscountRecord | null>;
    findRedemption(customerId: string, discountId: string): Promise<RedemptionRecord | null>;
    insertRedemption(redemption: RedemptionRecord): Promise<void>;
}

export async function applyDiscountCode(
    customerId: string,
    orderTotalCents: number,
    codeString: string,
    currentTimestamp: number,
    db: DatabaseMock
): Promise<DiscountResult> {
    // Step 1: Validate positive order total
    if (orderTotalCents <= 0) {
        throw new Error("INVALID_ORDER_TOTAL: Order total must be greater than zero");
    }

    // Step 2 & 3: Look up discount record
    const discount = await db.findDiscountByCode(codeString);
    if (!discount) {
        throw new Error("CODE_NOT_FOUND: Provided discount code does not exist");
    }

    // Step 4: Expiration check
    if (currentTimestamp > discount.expiresAt) {
        throw new Error("CODE_EXPIRED: Discount code has expired");
    }

    // Step 5: Minimum spend check
    if (orderTotalCents < discount.minSpendCents) {
        throw new Error("MIN_SPEND_NOT_MET: Order does not meet minimum qualifying spend");
    }

    // Step 6 & 7: One-use-per-customer check
    const existingRedemption = await db.findRedemption(customerId, discount.id);
    if (existingRedemption) {
        throw new Error("ALREADY_REDEEMED: Discount code has already been used by this customer");
    }

    // Step 8: Calculate raw discount amount
    let calculatedDiscount = 0;
    if (discount.type === "percentage") {
        calculatedDiscount = Math.floor((orderTotalCents * discount.value) / 100);
    } else if (discount.type === "fixed") {
        calculatedDiscount = discount.value;
    } else {
        throw new Error("INVALID_DISCOUNT_TYPE: Unknown discount type configuration");
    }

    // Step 9: Clamp discount so it cannot exceed order total
    let actualDiscount = calculatedDiscount;
    if (calculatedDiscount > orderTotalCents) {
        actualDiscount = orderTotalCents;
    }

    // Step 10: Calculate final total
    const finalTotalCents = orderTotalCents - actualDiscount;

    // Step 11: Write state change
    await db.insertRedemption({
        customerId,
        discountId: discount.id,
        redeemedAt: currentTimestamp,
    });

    // Step 12: Return final payload
    return {
        finalTotalCents,
        discountAppliedCents: actualDiscount,
        code: discount.code,
    };
}