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

type UniqueCheckerType<T> = (
  val: T,
  currentUniqueValSet: Set<T>
) => boolean | [boolean, T];

/**
 * get unique array entries
 */
export const getUniqueArrayEntries = <T>(
  vals: T[],
  valueIsUniqueChecker?: UniqueCheckerType<T>,
  keepFirst = true
): T[] => {
  const valSet = new Set<T>();
  vals.forEach((val) => {
    let valAlreadyExists = valSet.has(val);
    let valToDelete: T = val;
    if (valueIsUniqueChecker) {
      const result = valueIsUniqueChecker(val, valSet);
      if (Array.isArray(result)) {
        valAlreadyExists = !result[0];
        valToDelete = result[1];
      } else {
        valAlreadyExists = result;
      }
    }
    if (valAlreadyExists) {
      if (keepFirst) {
        return;
      }
      valSet.delete(valToDelete);
    }
    valSet.add(val);
  });
  return Array.from(valSet);
};

/**
 * checks that the string values are equal using a non-case sensitive, normalized comparison
 * @param valueA - value to search for
 * @param valueB - array of strings to search in
 * @param normalize - function to normalize the string values
 * @returns true if the values are equal, false otherwise
 */
export const isNormalizedEqual = (
  valA: string,
  valB: string,
  normalize: (val: string) => string = (val) =>
    val.toLowerCase().trim().replaceAll(/\s+/g, '')
): boolean => {
  const normalizedValA = normalize(valA);
  const normalizedValB = normalize(valB);
  return normalizedValA === normalizedValB;
};

/**
 * finds the first matching value in an array of strings using a non-case sensitive, normalized comparison
 * @param value - value to search for
 * @param values - array of strings to search in
 * @param normalize - function to normalize the string values
 * @param getStringValue - function to get the string value from the object
 * @returns the first matching value, null if no match
 */
export const findNormalizedValue = <T>(
  values: T[],
  value: string,
  getStringValue?: (val: T) => string,
  normalize?: (val: string) => string
): T | undefined => {
  return values.find((val) => {
    const valStr = getStringValue ? getStringValue(val) : val;
    if (typeof valStr !== 'string') {
      throw new Error(
        'findNormalizedValue: expected string value, got ' + typeof valStr
      );
    }
    return isNormalizedEqual(value, valStr, normalize);
  });
};
