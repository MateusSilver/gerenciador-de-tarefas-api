"use client";
import { useState, SyntheticEvent } from "react";
import { type Tasktype } from "@/components/TaskCard";

import { Plus } from "lucide-react";
import { Spinner } from "@/components/Spinner";

interface EditTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  task: Tasktype;
}

export function EditTaskModal({
  isOpen,
  onClose,
  onSuccess,
  task,
}: EditTaskModalProps) {
  // estados dos valores do formulário
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [status, setStatus] = useState(task.status);
  const [priority, setPriority] = useState(task.priority);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // garantir que os dados estejam no modal
  if (!isOpen) return null;

  async function handleSubmit(e: SyntheticEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title,
          description: description,
          status: status,
          priority: priority,
        }),
      });
      if (response.ok) {
        onSuccess();
        onClose();
      } else {
        alert("Erro ao atualizar a tarefa.");
      }
    } catch (error) {
      console.log("Erro no PATCH: ", error);
    } finally {
      setIsSubmitting(false);
    }
  }
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200 ">
          Editar Tarefa
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Título
            </label>
            <textarea
              minLength={1}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-gray-700 dark:text-gray-300 w-full border border-gray-300 rounded-md p-2 focus:outline-none bg-gray-50 dark:bg-gray-500 dark:bg-gray-600 focus:ring-2 focus:ring-sky-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Descrição
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="text-gray-700 dark:text-gray-300 w-full border border-gray-300 rounded-md px-3 py-2 h-24 focus:ring-sky-500 focus:ring-2 focus:ring-sky-500 resize-none bg-gray-50 dark:bg-gray-500 dark:bg-gray-600 focus:outline-none"
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="text-gray-700 dark:text-gray-300 w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 dark:bg-gray-500 dark:bg-gray-600"
              >
                <option value="TODO">A fazer</option>
                <option value="IN_PROGRESS">Em andamento</option>
                <option value="DONE">Concluído</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Prioridade
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="text-gray-700 dark:text-gray-300 w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 dark:bg-gray-500 dark:bg-gray-600"
              >
                <option value="LOW">Baixa</option>
                <option value="MEDIUM">Média</option>
                <option value="HIGH">Alta</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="text-gray-800 dark:text-gray-300 px-4 py-2 text-gray-600 bg-none dark:bg-none hover:bg-gray-200 dark:hover:bg-gray-500 rounded-md font-medium transition"
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-white bg-sky-500 hover:bg-sky-600 rounded-md font-medium transition flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Spinner />
                  Salvando...
                </>
              ) : (
                <>
                  <Plus size={16} className="mr-2" /> Salvar
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
