import imagekit from "@/lib/imagekit";

export async function GET() {

  const authenticationParameters =
    imagekit.getAuthenticationParameters();

  return Response.json(
    authenticationParameters
  );
}