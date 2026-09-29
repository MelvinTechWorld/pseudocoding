# Part A2.1: Open-Source Function (Short) - Zod `safeParse`

## Source Code Reference (simplified from `zod/lib/types.ts`)
```typescript
safeParse(data: unknown): SafeParseReturnType<Output, Input> {
  const result = this._parseSync({
    data,
    path: [],
    parent: null,
  });
  
  if (result.ok) {
    return { success: true, data: result.value };
  } else {
    return { success: false, error: new ZodError(result.issues) };
  }
}