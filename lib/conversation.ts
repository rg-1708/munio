import { db } from "@/lib/db";

export const getOrCreateConversation = async (
  memberOneId: string,
  memberTwoId: string
) => {
  let conversation =
    (await findCovnersation(memberOneId, memberTwoId)) ||
    (await findCovnersation(memberTwoId, memberOneId));

  if (!conversation) {
    conversation = await createNewCovnersation(memberOneId, memberTwoId);
  }

  return conversation;
};

const findCovnersation = async (memberOneId: string, memberTwoId: string) => {
  try {
    return await db.conversation.findFirst({
      where: {
        AND: [
          {
            memberOneId: memberOneId,
          },
          {
            memberTwoId: memberTwoId,
          },
        ],
      },
      include: {
        memberOne: {
          include: {
            profile: true,
          },
        },
        memberTwo: {
          include: {
            profile: true,
          },
        },
      },
    });
  } catch (error) {
    return null;
  }
};

const createNewCovnersation = async (
  memberOneId: string,
  memberTwoId: string
) => {
  try {
    return await db.conversation.create({
      data: {
        memberOneId,
        memberTwoId,
      },
      include: {
        memberOne: {
          include: {
            profile: true,
          },
        },
        memberTwo: {
          include: {
            profile: true,
          },
        },
      },
    });
  } catch (error) {
    return null;
  }
};
