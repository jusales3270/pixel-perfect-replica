import { useState } from "react";
import { MoveRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { List } from "@/lib/store";

interface MoveCardDialogProps {
  currentListId: string;
  availableLists: List[];
  onMove: (newListId: string) => void;
}

export const MoveCardDialog = ({
  currentListId,
  availableLists,
  onMove,
}: MoveCardDialogProps) => {
  const [open, setOpen] = useState(false);
  const [selectedListId, setSelectedListId] = useState(currentListId);

  const handleMove = () => {
    if (selectedListId && selectedListId !== currentListId) {
      onMove(selectedListId);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="w-full justify-start gap-2" size="sm">
          <MoveRight className="h-4 w-4" />
          Move
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Move Card</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Select List</label>
            <Select value={selectedListId} onValueChange={setSelectedListId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a list" />
              </SelectTrigger>
              <SelectContent>
                {availableLists.map((list) => (
                  <SelectItem
                    key={list.id}
                    value={list.id}
                    disabled={list.id === currentListId}
                  >
                    {list.title}
                    {list.id === currentListId && " (current)"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleMove}
              disabled={selectedListId === currentListId}
              className="flex-1"
            >
              Move Card
            </Button>
            <Button onClick={() => setOpen(false)} variant="outline">
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
