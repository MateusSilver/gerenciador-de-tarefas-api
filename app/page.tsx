"use client";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Home() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Carregando...
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-500 dark:bg-gray-900">
      <div className="fixed top-2 right-2">
        <ThemeToggle />
      </div>
      <div className="bg-white dark:bg-gray-800 p-12 rounded-md shadow-lg text-center max-w-md w-full">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-4">
          Gerenciador de Tarefas
        </h1>
        <p className="text-gray-600 dark:text-gray-200 text-md mb-8">
          Organize sua rotina
        </p>
        <button
          onClick={() => signIn("google")}
          className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 px-4 rounded-md capitalize"
        >
          Entrar com Google
        </button>
      </div>
    </main>
  );
}
