import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

// modelo de task obrigatório
const createTaskSchema = z.object({
  title: z.string().min(1, "Campo obrigatório"),
  description: z.string().optional(),
  status: z.enum(["TODO", "IN_PROGRESS", "DONE"]).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
  userId: z.string().min(1, "Campo obrigatório"), //retirar na fase 3
});

// pegar lista de tarefas
export async function GET() {
  try {
    const tasks = await prisma.task.findMany({
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
    // corpo da requisição
    const body = await request.json();

    // validação do zod
    const result = createTaskSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.issues }, { status: 400 });
    }

    // postar tarefa
    const newTask = await prisma.task.create({
      data: result.data,
    });
    return NextResponse.json(newTask, { status: 201 });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao criar tarefa" },
      { status: 500 },
    );
  }
}
