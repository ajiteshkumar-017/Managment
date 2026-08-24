import { NextResponse } from "next/server";
import { seedNotifications } from "../seedNotifications";

export async function GET() {
  try {
    const result = await seedNotifications();

    return NextResponse.json(
      {
        success: true,
        message: "Notifications seeded successfully",
        data: result,
      },
      { status: 201 },
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to seed notifications";
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: 500 },
    );
  }
}
