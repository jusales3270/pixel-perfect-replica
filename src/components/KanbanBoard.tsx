import { useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { KanbanColumn } from "./KanbanColumn";
import { KanbanCard } from "./KanbanCard";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import { AddTaskDialog } from "./AddTaskDialog";

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: string;
}

const initialTasks: Task[] = [
  {
    id: "1",
    title: "Design da nova landing page",
    description: "Criar mockups e wireframes para a nova página inicial",
    status: "todo",
  },
  {
    id: "2",
    title: "Implementar autenticação",
    description: "Adicionar sistema de autenticação baseado em JWT",
    status: "in-progress",
  },
  {
    id: "3",
    title: "Escrever documentação da API",
    description: "Documentar todos os endpoints REST",
    status: "in-progress",
  },
  {
    id: "4",
    title: "Configurar pipeline CI/CD",
    description: "Configurar GitHub Actions para deploys automatizados",
    status: "done",
  },
];

const columns = [
  { id: "todo", title: "A Fazer", color: "hsl(30 95% 55%)" },
  { id: "in-progress", title: "Em Progresso", color: "hsl(12 88% 60%)" },
  { id: "done", title: "Concluído", color: "hsl(140 70% 50%)" },
];

export const KanbanBoard = () => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find((t) => t.id === event.active.id);
    if (task) {
      setActiveTask(task);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const taskId = active.id as string;
    const newStatus = over.id as string;

    setTasks((tasks) =>
      tasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  };

  const handleAddTask = (task: Omit<Task, "id">) => {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
    };
    setTasks([...tasks, newTask]);
    setIsAddDialogOpen(false);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter((t) => t.id !== taskId));
  };

  return (
    <div className="min-h-screen p-6 md:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            Quadro de Projetos
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Organize e acompanhe suas tarefas
          </p>
        </div>
          <Button
            onClick={() => setIsAddDialogOpen(true)}
            size="lg"
            className="gap-2 shadow-lg glow-on-hover"
          >
            <Plus className="h-5 w-5" />
            Adicionar Tarefa
          </Button>
        </div>

        {/* Kanban Board */}
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {columns.map((column) => {
              const columnTasks = tasks.filter((task) => task.status === column.id);
              return (
                <KanbanColumn
                  key={column.id}
                  id={column.id}
                  title={column.title}
                  color={column.color}
                  tasks={columnTasks}
                  onDeleteTask={handleDeleteTask}
                />
              );
            })}
          </div>

          <DragOverlay>
            {activeTask ? (
              <div className="rotate-3 opacity-80">
                <KanbanCard task={activeTask} />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>

        <AddTaskDialog
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          onAddTask={handleAddTask}
        />
      </div>
    </div>
  );
};
