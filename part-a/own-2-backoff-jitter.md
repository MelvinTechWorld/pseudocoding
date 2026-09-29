# Part A1.2: Exponential Backoff with Jitter Calculation (`computeBackoffDelay`)

## Source Code Reference (from Task 2: `background-jobs/src/config.ts`)
```typescript
function computeBackoffDelay(
  attempts: number, 
  baseDelayMs: number = 1000, 
  jitterMaxMs: number = 500
): number {
  if (attempts < 1) {
    throw new Error("Attempts must be at least 1");
  }
  const exponentialPart = baseDelayMs * Math.pow(2, attempts - 1);
  const jitterPart = Math.floor(Math.random() * (jitterMaxMs + 1));
  return exponentialPart + jitterPart;
}