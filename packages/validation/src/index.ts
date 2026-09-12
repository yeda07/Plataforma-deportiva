export type ValidationResult<TValue> =
  | Readonly<{
      success: true;
      data: TValue;
    }>
  | Readonly<{
      success: false;
      errors: readonly string[];
    }>;
