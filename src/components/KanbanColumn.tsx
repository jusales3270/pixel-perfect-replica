import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { KanbanCard } from "./KanbanCard";
import type { Task } from "./KanbanBoard";

interface KanbanColumnProps {
  id: string;
  title: string;
  color: string;
  tasks: Task[];
  onDeleteTask: (taskId: string) => void;
}

export const KanbanColumn = ({
  id,
  title,
  color,
  tasks,
  onDeleteTask,
}: KanbanColumnProps) => {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  return (
    <div className="flex flex-col">
      {/* Column Header */}
      <div className="mb-4 flex items-center gap-3">
        <div
          className="h-3 w-3 rounded-full shadow-md"
          style={{ backgroundColor: color }}
        />
        <h2 className="text-xl font-semibold">{title}</h2>
        <span className="ml-auto flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-medium">
          {tasks.length}
        </span>
      </div>

      {/* Column Content */}
      <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
        <div
          ref={setNodeRef}
          className={`min-h-[400px] rounded-2xl bg-column-bg p-4 transition-smooth ${
            isOver ? "ring-2 ring-primary shadow-xl" : ""
          }`}
        >
          <div className="space-y-3">
            {tasks.map((task) => (
              <KanbanCard
                key={task.id}
                task={task}
                onDelete={() => onDeleteTask(task.id)}
              />
            ))}
            {tasks.length === 0 && (
              <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
                Solte as tarefas aqui
              </div>
            )}
          </div>
        </div>
      </SortableContext>
    </div>
  );
};
