/* eslint-disable @next/next/no-img-element */
"use client";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { TaskCard, type Tasktype } from "@/components/TaskCard";
import { NewTaskModal } from "@/components/NewTaskModal";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // tasks reactions
  const [tasks, setTasks] = useState<Tasktype[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // protegendo rota
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchTasks();
    }
  }, [status]);

  async function fetchTasks() {
    try {
      const response = await fetch("/api/tasks"); // chama get
      if (!response.ok) throw new Error("falha de busca no BD");

      const data = await response.json();
      setTasks(data); // guarda dados
    } catch (error) {
      console.log("falha no fetch: ", error);
    } finally {
      setIsLoading(false); // para de carregar
    }
  }

  if (status == "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Carregando...
      </div>
    );
  }
  if (!session) return null;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <header className="max-w mx-auto flex flex-row justify-between items-center bg-white p-4 rounded-lg shadow-sm mb-8">
        <div className="flex items-center gap-4">
          <img
            src={session.user?.image || "/#"}
            alt="Foto de perfil"
            className="rounded-full w-12 h-12"
          />
          <div>
            <h2 className="text-xl font-bold capitalize text-gray-800">
              Bem vindo, {session.user?.name}
            </h2>
            <p className="text-gray-600 text-sm">{session.user?.email}</p>
          </div>
        </div>
        <button
          onClick={() => signOut()}
          className="bg-red-500 hover:bg-red-700 text-white capitalize py-2 px-4 rounded-sm transition"
        >
          Sign Out
        </button>
      </header>
      <main className="max-w max-auto">
        <div className="bg-white p-6 rounded-lg shadow-sm min-h-[400px]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 capitalize">
              Minhas tarefas
            </h2>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-sky-600 text-white hover:bg-sky-700 py-2 px-4 rounded-sm transition"
            >
              Nova Tarefa
            </button>
          </div>
          <div className="mt-6 flex flex-col gap-4">
            {/* aqui onde vão ficar tarefas */}
            {isLoading ? (
              <p className="text-gray-600 mt-4">Carregando tarefas...</p>
            ) : tasks.length === 0 ? (
              <p className="text-gray-600 mt-4">Nenhuma tarefa encontrada.</p>
            ) : (
              tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onTaskChanged={fetchTasks}
                />
              ))
            )}
          </div>
        </div>
      </main>
      <NewTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSucess={fetchTasks}
      />
    </div>
  );
}
