import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ req, token }) => {
      if (req.nextUrl.pathname.startsWith("/admin")) {
        // Return true only if token has the role SUPERADMIN
        return token?.role === "SUPERADMIN";
      }
      return true;
    },
  },
});

export const config = {
  matcher: ["/admin/:path*"],
};
