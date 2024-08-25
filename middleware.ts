import NextAuth from "next-auth"
import authConfig from "./auth/config"

export const { auth } = NextAuth(authConfig)

export default auth((req) => {
  if (!req.auth) {
    const url = req.url.replace(req.nextUrl.pathname, `/login?callbackUrl=${encodeURIComponent(req.url)}`)
    return Response.redirect(url)
  }
})

export const config = {
  matcher: ["/account"],
}