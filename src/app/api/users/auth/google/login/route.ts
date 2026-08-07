import { NextResponse,NextRequest } from "next/server";
import { getGoogleAuthURL } from "@/lib/google";

export async function GET(request: NextRequest){
    const url = getGoogleAuthURL();

    return NextResponse.redirect(url);
}