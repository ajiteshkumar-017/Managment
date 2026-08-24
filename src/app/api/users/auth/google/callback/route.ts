import { getGoogleUser, verifyGoogleToken } from "@/lib/google";
import { User } from "@/models/user";
import { Student } from "@/models/student.model";
import Connect from "@/dbConnect/connect";
import { NextResponse, NextRequest } from "next/server";
import { SignJWT } from "jose";
import { createRequestLogger } from "@/lib/requestLogger";
import type { Types } from "mongoose";

/** Ensure every student-role user has a Student profile row. */
async function ensureStudentProfile(userId: Types.ObjectId) {
  const existing = await Student.findOne({ userId });
  if (existing) return existing;

  return Student.create({ userId });
}

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

async function createSessionToken(user: {
  _id: unknown;
  email: string;
  role: string;
}) {
  return new SignJWT({
    _id: String(user._id),
    email: user.email,
    role: user.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("1d")
    .sign(secret);
}

function redirectWithSession(request: NextRequest, path: string, token: string) {
  const response = NextResponse.redirect(new URL(path, request.url));
  response.cookies.set("token", token, {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
  });
  return response;
}

export async function GET(request: NextRequest) {
  const logger = createRequestLogger();

  try {
    await Connect();

    const code = request.nextUrl.searchParams.get("code");
    const oauthError = request.nextUrl.searchParams.get("error");

    if (oauthError) {
      logger.warn({ oauthError }, "Google OAuth denied");
      return NextResponse.redirect(
        new URL(`/landingPage?error=${encodeURIComponent(oauthError)}`, request.url),
      );
    }

    if (!code) {
      return NextResponse.json(
        { success: false, message: "Authorization code missing" },
        { status: 400 },
      );
    }

    const token = await getGoogleUser(code);
    if (!token?.id_token) {
      return NextResponse.json(
        { success: false, message: "Invalid authorization code" },
        { status: 400 },
      );
    }

    const payload = await verifyGoogleToken(token.id_token);
    if (!payload) {
      return NextResponse.json(
        { success: false, message: "Invalid Google token payload" },
        { status: 400 },
      );
    }

    const { email, name, picture, sub, email_verified } = payload;

    if (!email_verified) {
      return NextResponse.json(
        { success: false, message: "Email not verified" },
        { status: 400 },
      );
    }

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email not found in Google profile" },
        { status: 400 },
      );
    }

    let user = await User.findOne({
      $or: [{ email }, ...(sub ? [{ googleId: sub }] : [])],
    });

    if (!user) {
      user = await User.create({
        email,
        username: name || email.split("@")[0],
        avatar: picture,
        googleId: sub,
        authProvider: "google",
        profileCompleted: false,
        email_verified: true,
        role: "student",
      });

      const student = await ensureStudentProfile(user._id);
      if (!student) {
        await User.deleteOne({ _id: user._id });
        logger.error({ email }, "Google OAuth: failed to create student profile");
        return NextResponse.redirect(
          new URL("/landingPage?error=google_auth_failed", request.url),
        );
      }

      logger.info(
        { userId: user._id, studentId: student._id, email },
        "Google OAuth: new user + student created",
      );
    } else {
      // Link Google account / refresh profile fields for returning users
      let dirty = false;

      if (sub && user.googleId !== sub) {
        user.googleId = sub;
        dirty = true;
      }
      if (user.authProvider !== "google" && !user.password) {
        user.authProvider = "google";
        dirty = true;
      }
      if (picture && !user.avatarPublicId && user.avatar !== picture) {
        user.avatar = picture;
        dirty = true;
      }
      if (name && !user.username) {
        user.username = name;
        dirty = true;
      }
      if (!user.email_verified) {
        user.email_verified = true;
        dirty = true;
      }

      if (dirty) {
        await user.save();
      }

      // Backfill Student for older Google users / email users missing the row
      if (user.role === "student") {
        const student = await ensureStudentProfile(user._id);
        logger.info(
          { userId: user._id, studentId: student._id, email },
          "Google OAuth: existing user signed in",
        );
      } else {
        logger.info({ userId: user._id, email }, "Google OAuth: existing user signed in");
      }
    }

    const sessionToken = await createSessionToken({
      _id: user._id,
      email: user.email,
      role: user.role,
    });

    const destination =
      user.role === "admin"
        ? "/admin/dashboard"
        : user.role === "faculty"
          ? "/faculty/dashboard"
          : user.profileCompleted
            ? "/dashboard"
            : "/setUp";

    return redirectWithSession(request, destination, sessionToken);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Google callback failed";
    logger.error({ err }, "Google OAuth callback failed");
    console.log("Error in Google Callback:", message);

    return NextResponse.redirect(
      new URL(`/landingPage?error=${encodeURIComponent("google_auth_failed")}`, request.url),
    );
  }
}
