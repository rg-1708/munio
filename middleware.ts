import { authMiddleware } from "@clerk/nextjs";
 
// Added uploadthing as a public route, to avoid potential errors
// See : uploadthing documentation.
export default authMiddleware({
      publicRoutes: ["/api/uploadthing"]
});
 
export const config = {
      matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
 
