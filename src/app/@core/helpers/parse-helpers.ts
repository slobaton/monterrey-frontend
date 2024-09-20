function parseStringToBool(value: string): boolean {
  return value.toLowerCase() === 'true';
}

function parseStringToNumber(value: string): number {
  return Number.parseInt(value);
}

export {
  parseStringToBool,
  parseStringToNumber,
};
