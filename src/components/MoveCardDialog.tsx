import { useState } from "react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import type { Board, List } from "@/lib/store";

interface MoveCardDialogProps {
  currentBoardId: string;
  currentListId: string;
  allBoards: Board[];
  onMove: (targetBoardId: string, targetListId: string) => void;
  onClose: () => void;
}

export const MoveCardDialog = ({
  currentBoardId,
  currentListId,
  allBoards,
  onMove,
  onClose,
}: MoveCardDialogProps) => {
  const [selectedBoardId, setSelectedBoardId] = useState(currentBoardId);
  const [selectedListId, setSelectedListId] = useState(currentListId);

  const selectedBoard = allBoards.find((b) => b.id === selectedBoardId);
  const currentList = allBoards
    .find((b) => b.id === currentBoardId)
    ?.lists.find((l) => l.id === currentListId);

  const handleMove = () => {
    if (selectedBoardId !== currentBoardId || selectedListId !== currentListId) {
      onMove(selectedBoardId, selectedListId);
    }
    onClose();
  };

  return (
    <div className="w-80 space-y-4 p-1">
      <div>
        <h3 className="font-semibold mb-3">Mover cartão</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Selecione o destino para este cartão
        </p>
      </div>

      <div className="space-y-3">
        <div className="space-y-2">
          <Label htmlFor="board-select" className="text-xs font-semibold">
            Quadro
          </Label>
          <Select value={selectedBoardId} onValueChange={setSelectedBoardId}>
            <SelectTrigger id="board-select">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {allBoards.map((board) => (
                <SelectItem key={board.id} value={board.id}>
                  {board.title}
                  {board.id === currentBoardId && " (atual)"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="list-select" className="text-xs font-semibold">
            Lista
          </Label>
          <Select
            value={selectedListId}
            onValueChange={setSelectedListId}
            disabled={!selectedBoard || selectedBoard.lists.length === 0}
          >
            <SelectTrigger id="list-select">
              <SelectValue placeholder="Selecione uma lista" />
            </SelectTrigger>
            <SelectContent>
              {selectedBoard?.lists.map((list) => (
                <SelectItem key={list.id} value={list.id}>
                  {list.title}
                  {list.id === currentListId &&
                    selectedBoardId === currentBoardId &&
                    " (atual)"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedBoard && selectedBoard.lists.length === 0 && (
          <p className="text-xs text-muted-foreground">
            Este quadro não possui listas
          </p>
        )}
      </div>

      <div className="flex gap-2 pt-2">
        <Button onClick={handleMove} className="flex-1" size="sm">
          Mover
        </Button>
        <Button onClick={onClose} variant="ghost" size="sm">
          Cancelar
        </Button>
      </div>
    </div>
  );
};
