
export const USERNAME_RULE = /^[a-zA-Z0-9_]{3,50}$/;
export const MIN_PASSWORD_LENGTH = 8;

export function validateUsername(username: string): string | null {
  if (!USERNAME_RULE.test(username)) {
    return "Username 3-50 karakter, hanya huruf, angka, dan _";
  }
  return null;
}

export function validatePassword(password: string): string | null {
  if (password.length < MIN_PASSWORD_LENGTH) {
    return `Password minimal ${MIN_PASSWORD_LENGTH} karakter`;
  }
  if (password.length > 100) {
    return "Password terlalu panjang";
  }
  return null;
}
