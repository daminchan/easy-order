import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const student = await db.student.findUnique({
      where: {
        id: userId,
      },
    });

    return NextResponse.json(student);
  } catch (error) {
    console.error("[STUDENT_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
