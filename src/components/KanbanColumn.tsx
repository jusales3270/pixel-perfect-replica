import { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Plus, MoreHorizontal, GripVertical } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { KanbanCard } from "./KanbanCard";
import type { List } from "@/lib/store";

interface KanbanColumnProps {
  list: List;
  onAddCard: (listId: string, title: string) => void;
  onDeleteCard: (cardId: string) => void;
  onDuplicateCard: (cardId: string) => void;
  onCardClick: (card: import("@/lib/store").Card) => void;
}

export const KanbanColumn = ({ list, onAddCard, onDeleteCard, onDuplicateCard, onCardClick }: KanbanColumnProps) => {
  const [showAddCard, setShowAddCard] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState("");
  const { setNodeRef, isOver } = useDroppable({
    id: list.id,
  });

  const handleAddCard = () => {
    if (!newCardTitle.trim()) return;
    onAddCard(list.id, newCardTitle.trim());
    setNewCardTitle("");
    setShowAddCard(false);
  };

  return (
    <div className="w-80 shrink-0">
      {/* Column Header */}
      <div className="mb-3 flex items-center gap-2 px-2">
        <GripVertical className="h-4 w-4 text-white/60" />
        <h3 className="flex-1 font-semibold text-white">{list.title}</h3>
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-xs font-medium text-white">
          {list.cards.length}
        </span>
        <Button variant="ghost" size="icon" className="h-6 w-6 text-white hover:bg-white/20">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>

      {/* Column Content */}
      <SortableContext items={list.cards.map((c) => c.id)} strategy={verticalListSortingStrategy}>
        <div
          ref={setNodeRef}
          className={`min-h-[200px] rounded-xl p-3 backdrop-blur-sm transition-all duration-300 ${
            isOver 
              ? "bg-white/25 ring-2 ring-white/50 scale-[1.02]" 
              : "bg-black/10"
          }`}
        >
          <div className="space-y-3">
            {list.cards.map((card) => (
              <KanbanCard 
                key={card.id} 
                card={card} 
                onDelete={() => onDeleteCard(card.id)}
                onDuplicate={() => onDuplicateCard(card.id)}
                onClick={() => onCardClick(card)}
              />
            ))}

            {/* Add Card Button */}
            {showAddCard ? (
              <div className="rounded-lg bg-white p-3 shadow-lg">
                <Input
                  autoFocus
                  value={newCardTitle}
                  onChange={(e) => setNewCardTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAddCard();
                    if (e.key === "Escape") setShowAddCard(false);
                  }}
                  placeholder="Digite o título do cartão..."
                  className="mb-2"
                />
                <div className="flex gap-2">
                  <Button onClick={handleAddCard} size="sm">
                    Adicionar
                  </Button>
                  <Button onClick={() => setShowAddCard(false)} variant="ghost" size="sm">
                    Cancelar
                  </Button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowAddCard(true)}
                className="flex w-full items-center gap-2 rounded-lg p-2 text-sm text-white transition-colors hover:bg-white/10"
              >
                <Plus className="h-4 w-4" />
                <span>Adicionar um cartão</span>
              </button>
            )}
          </div>
        </div>
      </SortableContext>
    </div>
  );
};
