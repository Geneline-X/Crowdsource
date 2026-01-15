import { prisma } from "@/lib/prisma";
import { MainAppWrapper } from "@/app/components/main-app-wrapper";
import { Problem } from "@/lib/types";

export const dynamic = "force-dynamic";

async function getProblems() {
  try {
    const problems = await prisma.problem.findMany({
      orderBy: { upvoteCount: "desc" },
      include: {
        images: {
          select: {
            id: true,
            url: true,
            mimeType: true,
            size: true,
            createdAt: true
          }
        },
        media: {
          select: {
            id: true,
            url: true,
            mimeType: true,
            size: true,
            createdAt: true
          }
        }
      },
    });
    return JSON.parse(JSON.stringify(problems)) as Problem[];
  } catch (error) {
    console.error("Failed to fetch problems:", error);
    return [] as Problem[];
  }
}

export default async function HomePage() {
  const problems = await getProblems();

  return <MainAppWrapper initialProblems={problems} />;
}
