import { forwardRef } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Calendar, CheckSquare, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import type { Card } from "@/lib/store";

interface KanbanCardProps {
  card: Card;
  onDelete?: () => void;
}

export const KanbanCard = forwardRef<HTMLDivElement, KanbanCardProps>(
  ({ card, onDelete }, ref) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ id: card.id });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };

    const completedChecklist = card.checklist?.filter((item) => item.completed).length || 0;
    const totalChecklist = card.checklist?.length || 0;

    return (
      <div
        ref={setNodeRef}
        style={style}
        className={`group rounded-lg bg-white p-3 shadow-sm transition-shadow hover:shadow-md ${
          isDragging ? "opacity-50 cursor-grabbing" : ""
        }`}
      >
        {/* Cover Image */}
        {card.coverImage && (
          <img
            src={card.coverImage}
            alt={card.title}
            className="-mx-3 -mt-3 mb-3 h-32 w-[calc(100%+1.5rem)] rounded-t-lg object-cover"
          />
        )}

        {/* Tags */}
        {card.tags && card.tags.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-1">
            {card.tags.map((tag) => (
              <span
                key={tag.id}
                className="rounded px-2 py-1 text-xs font-medium text-white"
                style={{ backgroundColor: tag.color }}
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <div className="flex items-start gap-2">
          <button
            className="mt-0.5 cursor-grab text-muted-foreground hover:text-foreground active:cursor-grabbing"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-4 w-4" />
          </button>
          <h4 className="flex-1 text-sm font-medium leading-snug">{card.title}</h4>
          {onDelete && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
            >
              <Trash2 className="h-3 w-3 text-destructive" />
            </Button>
          )}
        </div>

        {/* Card Footer */}
        <div className="mt-2 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {/* Due Date */}
            {card.dueDate && (
              <div className="flex items-center gap-1 rounded bg-destructive/10 px-2 py-0.5 text-xs text-destructive">
                <Calendar className="h-3 w-3" />
                <span>{card.dueDate}</span>
              </div>
            )}

            {/* Checklist */}
            {card.checklist && card.checklist.length > 0 && (
              <div
                className={`flex items-center gap-1 rounded px-2 py-0.5 text-xs ${
                  completedChecklist === totalChecklist
                    ? "bg-green-500/10 text-green-600"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                <CheckSquare className="h-3 w-3" />
                <span>
                  {completedChecklist}/{totalChecklist}
                </span>
              </div>
            )}
          </div>

          {/* Members */}
          {card.members && card.members.length > 0 && (
            <div className="flex -space-x-1">
              {card.members.map((member) => (
                <Avatar key={member.id} className="h-6 w-6 border-2 border-white">
                  <AvatarFallback className="text-xs">{member.avatar}</AvatarFallback>
                </Avatar>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }
);

KanbanCard.displayName = "KanbanCard";
