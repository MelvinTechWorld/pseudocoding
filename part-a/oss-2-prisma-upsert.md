# Part A2.2: Open-Source Function (Medium) - Prisma `upsert`

## Source Code Reference (simplified concept from `@prisma/client` query engine)
```typescript
async function executeUpsert(
  model: string, 
  where: Record<string, any>, 
  update: Record<string, any>, 
  create: Record<string, any>
): Promise<any> {
  const existingRecord = await db.findUnique({ table: model, where });
  
  if (existingRecord) {
    return await db.update({ table: model, where, data: update });
  } else {
    try {
      return await db.create({ table: model, data: create });
    } catch (error) {
      if (error.code === 'UniqueConstraintViolation') {
        return await db.update({ table: model, where, data: update });
      }
      throw error;
    }
  }
}