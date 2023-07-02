export const updateObjectWithDefinedValues = <T extends {}>(
  obj: T,
  update: Partial<T>
): T => {
  return { ...obj, ...removeUndefinedOrNullEntries(update) };
};

// remove undefined or null attributes from an object
export const removeUndefinedOrNullEntries = <
  TComplete extends {},
  TPartial extends Partial<TComplete>
>(
  obj: TComplete
): TPartial => {
  const definedObjectEntries = Object.entries(obj).filter(
    ([_key, value]) => value != null
  );
  return Object.fromEntries(definedObjectEntries) as TPartial;
};
