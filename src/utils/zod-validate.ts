import type { z as zod } from "zod";

export function zodValidate<T extends zod.ZodType>(schema: T) {
  return (values: zod.input<T>) => {
    const result = schema.safeParse(values);

    if (result.success) return {};

    const errors: Record<string, string> = {};

    for (const issue of result.error.issues) {
      const path = issue.path.join(".");
      if (path && !errors[path]) {
        errors[path] = issue.message;
      }
    }

    return errors;
  };
}
