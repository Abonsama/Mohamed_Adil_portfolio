"use server";

export async function verifyPassword(inputPassword: string): Promise<boolean> {
  const secretPassword = process.env.ADMIN_PASSWORD;

  if (!secretPassword) {
    console.error("ADMIN_PASSWORD environment variable is not defined.");
    return false;
  }

  return inputPassword === secretPassword;
}