/* eslint-disable @next/next/no-img-element */
"use client";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-500">
      <h1 className="text-4xl font-bold mb-8">Gerenciador de Tarefas</h1>
      {session ? (
        <div className="text-center">
          <img
            src={session.user?.image || ""}
            alt={session.user?.name || "profile image"}
            width={112}
            height={112}
            className="rounded-full w-28 h-28 justify-center mb-4 mx-auto"
          />
          <p className="mb-4 text-lg">
            Bem vindo,{" "}
            <span className="text-sky-500">{session.user?.name}</span>!
          </p>

          <button
            onClick={() => signOut()}
            className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
          >
            Sair
          </button>
        </div>
      ) : (
        <div>
          <p>Voce não está logado</p>
          <button
            onClick={() => signIn()}
            className="bg-sky-500 text-white py-2 px-4 rounded-md hover:bg-sky-600"
          >
            Entrar com Google
          </button>
        </div>
      )}
    </main>
  );
}
