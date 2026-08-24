/** Panel home for a signed-in role. Unknown roles land on the student dashboard. */
export function homeForRole(role: string | undefined | null) {
  if (role === "admin") return "/admin/dashboard";
  if (role === "faculty") return "/faculty/dashboard";
  return "/dashboard";
}

/**
 * Login / password-reset surfaces. Logged-in users must not stay here.
 * `/` is an exact match — never prefix-match it or every path would count.
 */
export function isAuthEntryPath(pathname: string) {
  return (
    pathname === "/" ||
    pathname.startsWith("/landingPage") ||
    pathname.startsWith("/forgotPassword") ||
    pathname.startsWith("/reset-password")
  );
}
