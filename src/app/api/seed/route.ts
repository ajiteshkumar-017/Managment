import { NextRequest, NextResponse } from "next/server";
import { seedDatabase } from "./seedData";

export async function GET(request: NextRequest) {
  try {
    const result = await seedDatabase();

    return NextResponse.json(
      {
        success: true,
        message: "Database seeded successfully",
        data: result,
      },
      {
        status: 201,
      }
    );
  } catch (error: any) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      {
        status: 500,
      }
    );
  }
}
