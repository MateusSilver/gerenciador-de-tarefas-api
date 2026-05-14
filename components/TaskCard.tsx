"use client";
import { useState } from "react";
import { EditTaskModal } from "@/components/EditTaskModal";

import { SquarePen, Trash } from "lucide-react";

export type Tasktype = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
};

interface TaskCardProps {
  task: Tasktype;
  onTaskChanged: () => void;
}

export function TaskCard({ task, onTaskChanged }: TaskCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  // deletar task
  async function handleDelete() {
    const confirmacao = window.confirm(
      "Tem certeza que deseja excluir esta tarefa?",
    );
    if (!confirmacao) return;

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        onTaskChanged();
      } else {
        alert("Erro ao excluir a tarefa.");
      }
    } catch (error) {
      console.log("Erro no delete: ", error);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="border border-gray-200 dark:border-gray-600 p-4 rounded-md flex justify-between items-start hover:shadow-md transition bg-gray-50 dark:bg-gray-800 gap-2 pointer-cursor-default">
      <div>
        <h3 className="text-lg font-bold capitalize text-gray-800 dark:text-gray-200">
          {task.title}
        </h3>
        {task.description && (
          <p className="text-gray-600 dark:text-gray-200 text-sm mt-1">
            {task.description}
          </p>
        )}
        <div className="flex gap-2 mt-4">
          <span className="bg-sky-100 dark:bg-sky-800 text-sky-800 dark:text-sky-100 text-xs font-medium py-1 px-2 rounded">
            {task.status === "TODO"
              ? "A Fazer"
              : task.status === "IN_PROGRESS"
                ? "Em Progresso"
                : "Concluído"}
          </span>
          <span className="text-xs bg-purple-100 dark:bg-purple-800 text-purple-800 dark:text-purple-100 px-2 py-1 rounded font-medium">
            {task.priority === "LOW"
              ? "BAIXA"
              : task.priority === "MEDIUM"
                ? "MÉDIA"
                : "ALTA"}
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <button
          onClick={() => setIsEditOpen(true)}
          className="text-sm text-gray-500 hover:text-blue-600 font-medium transition-colors flex items-center dark:text-gray-200 dark:hover:text-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <SquarePen className="mr-2" size={16} />
          Editar
        </button>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="text-sm text-gray-500 hover:text-red-600 font-medium transition-colors flex items-center dark:text-gray-200 dark:hover:text-red-400 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Trash className="mr-2" size={16} />
          {isDeleting ? "Excluindo..." : "Excluir"}
        </button>
      </div>
      {isEditOpen && (
        <EditTaskModal
          task={task}
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          onSuccess={onTaskChanged}
        />
      )}
    </div>
  );
}
