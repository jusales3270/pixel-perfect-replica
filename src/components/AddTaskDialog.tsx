import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import type { Task } from "./KanbanBoard";

interface AddTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddTask: (task: Omit<Task, "id">) => void;
}

export const AddTaskDialog = ({
  open,
  onOpenChange,
  onAddTask,
}: AddTaskDialogProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("todo");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddTask({
      title: title.trim(),
      description: description.trim() || undefined,
      status,
    });

    // Reset form
    setTitle("");
    setDescription("");
    setStatus("todo");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Adicionar Nova Tarefa</DialogTitle>
          <DialogDescription>
            Crie uma nova tarefa para o seu quadro de projetos
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Título da Tarefa</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Digite o título da tarefa"
              className="transition-smooth"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição (Opcional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Adicione mais detalhes sobre a tarefa"
              className="min-h-[100px] transition-smooth"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todo">A Fazer</SelectItem>
                <SelectItem value="in-progress">Em Progresso</SelectItem>
                <SelectItem value="done">Concluído</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={!title.trim()}>
              Adicionar Tarefa
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
