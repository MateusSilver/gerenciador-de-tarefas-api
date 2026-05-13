"use client";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

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
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-500 ">
      <div className="bg-white p-12 rounded-md shadow-lg text-center max-w-md w-full">
        <h1 className="text-3xl font-bold text-gray-800">
          Gerenciador de Tarefas
        </h1>
        <p className="text-gray-600 text-md mb-8">Organize sua rotina</p>
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
