import { useState } from "react";
import { Tag as TagIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Tag } from "@/lib/store";

interface AddLabelDialogProps {
  onAddLabel: (label: Tag) => void;
}

const PRESET_COLORS = [
  "hsl(220 90% 56%)", // Blue
  "hsl(142 71% 45%)", // Green
  "hsl(25 95% 55%)",  // Orange
  "hsl(0 84% 60%)",   // Red
  "hsl(258 90% 66%)", // Purple
  "hsl(172 66% 50%)", // Teal
  "hsl(45 93% 47%)",  // Yellow
  "hsl(340 82% 52%)", // Pink
];

export const AddLabelDialog = ({ onAddLabel }: AddLabelDialogProps) => {
  const [open, setOpen] = useState(false);
  const [labelName, setLabelName] = useState("");
  const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0]);

  const handleCreate = () => {
    if (!labelName.trim()) return;

    const newLabel: Tag = {
      id: `tag${Date.now()}`,
      name: labelName.trim(),
      color: selectedColor,
    };

    onAddLabel(newLabel);
    setLabelName("");
    setSelectedColor(PRESET_COLORS[0]);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="w-full justify-start gap-2" size="sm">
          <div className="h-4 w-4 rounded bg-primary" />
          Labels
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create Label</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Label Name</label>
            <Input
              value={labelName}
              onChange={(e) => setLabelName(e.target.value)}
              placeholder="e.g., Priority, Bug, Feature"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCreate();
              }}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Color</label>
            <div className="grid grid-cols-4 gap-2">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`h-10 rounded-lg transition-all ${
                    selectedColor === color
                      ? "ring-2 ring-primary ring-offset-2"
                      : "hover:scale-110"
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <Button onClick={handleCreate} className="flex-1">
              Create Label
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
