import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { userId, orgId, sessionId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // より詳細なユーザー情報を返す
    const userInfo = {
      id: userId,
      orgId,
      sessionId,
    };

    return NextResponse.json({ user: userInfo });
  } catch (error) {
    console.error("[USER_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
