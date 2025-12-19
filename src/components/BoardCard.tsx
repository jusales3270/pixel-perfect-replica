import { useState } from "react";
import { Link } from "react-router-dom";
import { Star, MoreHorizontal, LayoutGrid, Plus } from "lucide-react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { store, Board } from "@/lib/store";

interface BoardCardProps {
  board: Board;
  onToggleFavorite: (id: string) => void;
  onDelete: (id: string) => void;
}

export const BoardCard = ({ board, onToggleFavorite, onDelete }: BoardCardProps) => {
  const listCount = board.lists.length;
  const cardCount = board.lists.reduce((acc, list) => acc + list.cards.length, 0);

  return (
    <div className="group relative overflow-hidden rounded-lg border border-border bg-card shadow-sm transition-all hover:shadow-md">
      {/* Color Header */}
      <div
        className="h-32"
        style={{
          background: `linear-gradient(135deg, ${board.color} 0%, ${board.color}dd 100%)`,
        }}
      />

      {/* Content */}
      <div className="p-4">
        <div className="mb-3 flex items-start justify-between">
          <Link
            to={`/board/${board.id}`}
            className="flex-1 font-semibold text-card-foreground hover:underline"
          >
            {board.title}
          </Link>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={(e) => {
                e.preventDefault();
                onToggleFavorite(board.id);
              }}
            >
              <Star
                className={`h-4 w-4 ${
                  board.isFavorite ? "fill-primary text-primary" : "text-muted-foreground"
                }`}
              />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onToggleFavorite(board.id)}>
                  {board.isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                </DropdownMenuItem>
                <DropdownMenuItem className="text-destructive" onClick={() => onDelete(board.id)}>
                  Excluir quadro
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {board.description && (
          <p className="mb-3 text-sm text-muted-foreground line-clamp-2">{board.description}</p>
        )}

        <div className="flex items-center justify-between">
          <div className="flex -space-x-2">
            {board.members.slice(0, 4).map((member) => (
              <Avatar key={member.id} className="h-6 w-6 border-2 border-card">
                <AvatarFallback className="text-xs">{member.avatar}</AvatarFallback>
              </Avatar>
            ))}
            {board.members.length > 4 && (
              <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-card bg-muted text-xs">
                +{board.members.length - 4}
              </div>
            )}
          </div>
          <span className="text-xs text-muted-foreground">
            {listCount} lists • {cardCount} cards
          </span>
        </div>

        <p className="mt-2 text-xs text-muted-foreground">Updated {board.updatedAt}</p>
      </div>
    </div>
  );
};

interface CreateBoardCardProps {
  onClick: () => void;
}

export const CreateBoardCard = ({ onClick }: CreateBoardCardProps) => {
  return (
    <button
      onClick={onClick}
      className="group relative flex h-full min-h-[240px] items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-border bg-card transition-all hover:border-primary hover:bg-secondary"
    >
      <div className="flex flex-col items-center gap-2">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary transition-transform group-hover:scale-110">
          <Plus className="h-6 w-6" />
        </div>
        <span className="font-medium">Criar Novo Quadro</span>
      </div>
    </button>
  );
};
