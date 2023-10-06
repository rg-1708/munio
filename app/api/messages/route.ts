import { NextResponse } from "next/server";
import { currentProfile } from "@/lib/current-profile";
import { Messsage } from "@prisma/client";
import { db } from "@/lib/db";

const MESSAGES_BATCH = 25;

export async function GET(request: Request) {
  try {
    const profile = await currentProfile();
    const { searchParams } = new URL(request.url);
    const cursor = searchParams.get("cursor");
    const channelId = searchParams.get("channelId");
    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!channelId) {
      return new NextResponse("Channel Id missing", { status: 400 });
    }

    let messages: Messsage[] = [];

    if (cursor) {
      messages = await db.messsage.findMany({
        take: MESSAGES_BATCH,
        skip: 1,
        cursor: {
          id: cursor,
        },
        where: {
          channelId,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } else {
      messages = await db.messsage.findMany({
        take: MESSAGES_BATCH,
        where: {
          channelId,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }

    let nextCursor = null;

    if (messages.length === MESSAGES_BATCH) {
      nextCursor = messages[MESSAGES_BATCH - 1].id;
    }

    return NextResponse.json({
      items: messages,
      nextCursor,
    });
  } catch (error) {
    console.log("[Messages_Get]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
