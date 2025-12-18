import { useState } from "react";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface CreateBoardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateBoard: (title: string, color: string) => void;
}

const boardColors = [
  { name: "Laranja", value: "hsl(25 95% 55%)" },
  { name: "Roxo", value: "hsl(258 90% 66%)" },
  { name: "Verde", value: "hsl(172 66% 50%)" },
  { name: "Rosa", value: "hsl(328 86% 70%)" },
  { name: "Vermelho", value: "hsl(8 92% 64%)" },
  { name: "Verde Lima", value: "hsl(84 81% 56%)" },
];

export const CreateBoardDialog = ({ open, onOpenChange, onCreateBoard }: CreateBoardDialogProps) => {
  const [title, setTitle] = useState("");
  const [selectedColor, setSelectedColor] = useState(boardColors[0].value);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onCreateBoard(title.trim(), selectedColor);
    setTitle("");
    setSelectedColor(boardColors[0].value);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Criar Novo Quadro</DialogTitle>
          <DialogDescription>
            Dê um título ao seu quadro e escolha uma cor de fundo.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Preview */}
          <div
            className="flex h-32 items-center justify-center rounded-lg"
            style={{
              background: `linear-gradient(135deg, ${selectedColor} 0%, ${selectedColor}dd 100%)`,
            }}
          >
            <span className="text-2xl font-bold text-white">
              {title || "Board Title"}
            </span>
          </div>

          {/* Title Input */}
          <div className="space-y-2">
            <Label htmlFor="title">Título do Quadro</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Digite o título do quadro..."
              className="border-primary/50 focus-visible:ring-primary"
            />
          </div>

          {/* Color Selection */}
          <div className="space-y-2">
            <Label>Fundo</Label>
            <div className="flex gap-2">
              {boardColors.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setSelectedColor(color.value)}
                  className={`h-12 w-12 rounded-lg border-4 transition-all ${
                    selectedColor === color.value
                      ? "border-foreground scale-110"
                      : "border-transparent hover:scale-105"
                  }`}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={!title.trim()}>
              Criar Quadro
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
