import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ProjectClient from "./ProjectClient";

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const projectId = parseInt(id);
  if (isNaN(projectId)) {
    notFound();
  }

  const project = await prisma.project.findUnique({
    where: { id: projectId }
  });

  if (!project) {
    notFound();
  }

  return <ProjectClient project={project} />;
}
