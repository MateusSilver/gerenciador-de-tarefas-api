"use client";
import { useState, SyntheticEvent } from "react";
import { useSession } from "next-auth/react";

interface NewTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSucess: () => void;
}

export function NewTaskModal({ isOpen, onClose, onSucess }: NewTaskModalProps) {
  const { data: session } = useSession();

  // estados
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // se fechado não renderizar
  if (!isOpen) return null;

  async function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault(); // evitar recarregamento
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title,
          description: description,
          status: "TODO",
          priority: "MEDIUM",
          userEmail: session?.user?.email,
        }),
      });
      if (response.ok) {
        // limpar formulário
        setTitle("");
        setDescription("");
        // avisar para fechar modal e buscar tarefas
        onSucess();
        onClose();
      } else {
        alert("erro ao criar tarefa");
      }
    } catch (error) {
      console.log("erro no POST: ", error);
    } finally {
      setIsSubmitting(false);
    }
  }
  return (
    <div className="fixed min-h-screen min-w-screen inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Nova Tarefa</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-medium text-gray-700 mb-1">
              Título da tarefa
            </label>
            <input
              type="text"
              required
              minLength={1}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 text-gray-400"
              placeholder="Digite o título da tarefa"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descrição
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline none focus:ring-2 focus:ring-sky-500 text-gray-400"
              placeholder="detalhes da tarefa..."
            />
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md font-medium transition"
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-white bg-sky-500 hover:bg-sky-600 rounded-md font-medium transition"
            >
              {isSubmitting ? "Criando..." : "Criar Tarefa"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
