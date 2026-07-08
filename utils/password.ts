export function generatePassword(length = 6): string {
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;

  return Math.floor(min + Math.random() * (max - min + 1)).toString();
}

export function isValidPassword(password: string, length = 6): boolean {
  return new RegExp(`^\\d{${length}}$`).test(password);
}

export function sanitizePassword(value: string, length = 6): string {
  return value.replace(/\D/g, "").slice(0, length);
}
