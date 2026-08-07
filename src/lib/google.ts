import { OAuth2Client } from "google-auth-library";

export const googleClient = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID!,
    process.env.GOOGLE_CLIENT_SECRET!,
    process.env.GOOGLE_REDIRECT_URI!
);

console.log("Google Client: ", googleClient);

export function getGoogleAuthURL(){
    return googleClient.generateAuthUrl({
        access_type: "offline",
        scope: [
            "openid",
            "email",
            "profile",
        ]
    })
}

export async function getGoogleUser(code: string){
    const {tokens} = await googleClient.getToken(code);

    return tokens;
}

export async function verifyGoogleToken(idToken: string) {
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID!,
    });
  
    return ticket.getPayload();
  }