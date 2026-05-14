import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// modelo de atualização de task
const updateTaskSchema = z.object({
  title: z.string().min(1, "Campo não pode ser vazio").optional(),
  description: z.string().optional(),
  status: z.enum(["TODO", "IN_PROGRESS", "DONE"]).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
});

// atualizar tarefa
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // verifica sessão
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: "Usuário não autorizado" },
        { status: 401 },
      );
    }

    const { id } = await params;
    const body = await request.json();

    // valida dados
    const result = updateTaskSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.issues }, { status: 400 });
    }

    // busca usuario
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    if (!user) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 },
      );
    }
    // busca tarefa e se pertence a usuario
    const existingtask = await prisma.task.findFirst({
      where: { id: id, userId: user.id },
    });

    if (!existingtask) {
      return NextResponse.json(
        { error: "Tarefa não encontrada ou não pertence ao usuário" },
        { status: 404 },
      );
    }

    // atualiza dados
    const updatedTask = await prisma.task.update({
      where: { id: id },
      data: {
        title: body.title,
        description: body.description,
        status: body.status,
        priority: body.priority,
      },
    });

    return NextResponse.json(updatedTask, { status: 200 });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao atualizar tarefa" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // verifica email
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: "Usuário não autorizado" },
        { status: 401 },
      );
    }
    // deleta pelo id
    const { id } = await params;
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 },
      );
    }

    // verifica se tarefa existe
    const task = await prisma.task.findUnique({
      where: { id: id },
    });

    if (!task) {
      return NextResponse.json(
        { error: "Tarefa não encontrada" },
        { status: 404 },
      );
    }

    // delete tarefa
    await prisma.task.delete({
      where: { id: id },
    });
    return NextResponse.json({ message: "Tarefa deletada" }, { status: 200 });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao deletar tarefa" },
      { status: 500 },
    );
  }
}
