export { default } from "next-auth/middleware"

export const config = { matcher: ["/dashboard/:path*", "/admin/:path*", "/inventory/:path*", "/calendar/:path*"] }
