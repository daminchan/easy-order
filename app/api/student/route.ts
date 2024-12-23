import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const student = await db.student.findUnique({
      where: { id: userId },
    });

    if (!student) {
      return new NextResponse("Student not found", { status: 404 });
    }

    return NextResponse.json(student);
  } catch (error) {
    console.error("[STUDENT_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
