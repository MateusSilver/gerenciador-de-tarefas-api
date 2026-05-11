import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

// modelo de atualização de task
const updateTaskSchema = z.object({
  title: z.string().min(1, "Campo não pode ser vazio").optional(),
  description: z.string().optional(),
  status: z.enum(["TODO", "IN_PROGRESS", "DONE"]).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
  userId: z.string().min(1, "Campo não pode ser vazio").optional(), //retirar na fase 3
});

// atualizar tarefa
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const result = updateTaskSchema.safeParse(body);

    // verificar validação
    if (!result.success) {
      return NextResponse.json({ error: result.error.issues }, { status: 400 });
    }
    // se tudo correto atualiza
    const updatedTask = await prisma.task.update({
      where: { id: id },
      data: result.data,
    });
    return NextResponse.json(updatedTask, { status: 200 });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json({ status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // deleta pelo id
    const { id } = await params;
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
