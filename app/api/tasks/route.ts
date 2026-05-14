import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
export const dynamic = "force-dynamic";

// modelo de task obrigatório
const createTaskSchema = z.object({
  title: z.string().min(1, "Campo obrigatório"),
  description: z.string().optional(),
  status: z.enum(["TODO", "IN_PROGRESS", "DONE"]).optional().default("TODO"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional().default("MEDIUM"),
});

// pegar lista de tarefas
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: "Usuário não autorizado" },
        { status: 401 },
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    if (!user) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 },
      );
    }

    const tasks = await prisma.task.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" }, // ordem crescente
    });

    return NextResponse.json(tasks, { status: 200 });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao buscar tarefas" },
      { status: 500 },
    );
  }
}

// postar uma tarefa
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: "Usuário não autorizado" },
        { status: 401 },
      );
    }

    // corpo da requisição
    const body = await request.json();

    // validação do zod
    const result = createTaskSchema.safeParse(body);
    if (!result.success) {
      console.log("Erro de validação zod: ", result.error.issues);
      return NextResponse.json({ error: result.error.issues }, { status: 400 });
    }

    // teste de email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    if (!user) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 },
      );
    }

    const { title, description, status, priority } = result.data;

    if (!user) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 },
      );
    }

    // postar tarefa
    const newTask = await prisma.task.create({
      data: {
        title: title,
        description: description,
        status: status,
        priority: priority,
        userId: user.id,
      },
    });
    return NextResponse.json(newTask, { status: 201 });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json({ error: "Erro de servidor" }, { status: 500 });
  }
}
