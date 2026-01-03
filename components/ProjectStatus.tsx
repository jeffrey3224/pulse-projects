"use client";

import { useProjectStore } from "@/lib/store/projectStore";
import { AiFillExclamationCircle } from "react-icons/ai";
import { FaCheckCircle } from "react-icons/fa";

type Props = {
  initialStatus: boolean;
  projectId: number;
};

export default function ProjectStatus({ initialStatus, projectId }: Props) {
  const { projects } = useProjectStore();

  const project = projects.find(p => p.id === projectId);
  if (!project) return;

  const isComplete =
    project?.steps?.length > 0 &&
    project.steps.every(step => step.completed);

  const completed = project ? isComplete : initialStatus;

  return completed ? (
    <FaCheckCircle className="text-green-500 mt-2" size={25} />
  ) : (
    <AiFillExclamationCircle className="text-yellow-400 mt-2" size={25} />
  );
}
