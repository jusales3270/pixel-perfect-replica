import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { X, Plus, Check, Pencil, Trash2 } from "lucide-react";
import type { Tag } from "@/lib/store";

interface LabelsManagerProps {
  availableTags: Tag[];
  selectedTags: Tag[];
  onAddTag: (tag: Tag) => void;
  onRemoveTag: (tagId: string) => void;
  onCreateTag: (name: string, color: string) => void;
  onUpdateTag: (tagId: string, name: string, color: string) => void;
  onDeleteTag: (tagId: string) => void;
}

const PRESET_COLORS = [
  { name: "Verde", color: "hsl(142 71% 45%)" },
  { name: "Amarelo", color: "hsl(45 93% 58%)" },
  { name: "Laranja", color: "hsl(25 95% 55%)" },
  { name: "Vermelho", color: "hsl(0 84% 60%)" },
  { name: "Roxo", color: "hsl(258 90% 66%)" },
  { name: "Azul", color: "hsl(220 90% 56%)" },
  { name: "Turquesa", color: "hsl(172 66% 50%)" },
  { name: "Rosa", color: "hsl(328 86% 70%)" },
  { name: "Cinza", color: "hsl(240 5% 65%)" },
];

export const LabelsManager = ({
  availableTags,
  selectedTags,
  onAddTag,
  onRemoveTag,
  onCreateTag,
  onUpdateTag,
  onDeleteTag,
}: LabelsManagerProps) => {
  const [isCreating, setIsCreating] = useState(false);
  const [editingTagId, setEditingTagId] = useState<string | null>(null);
  const [newTagName, setNewTagName] = useState("");
  const [newTagColor, setNewTagColor] = useState(PRESET_COLORS[0].color);
  const [editTagName, setEditTagName] = useState("");
  const [editTagColor, setEditTagColor] = useState("");

  const handleCreateTag = () => {
    if (newTagName.trim()) {
      onCreateTag(newTagName.trim(), newTagColor);
      setNewTagName("");
      setNewTagColor(PRESET_COLORS[0].color);
      setIsCreating(false);
    }
  };

  const handleUpdateTag = (tagId: string) => {
    if (editTagName.trim()) {
      onUpdateTag(tagId, editTagName.trim(), editTagColor);
      setEditingTagId(null);
      setEditTagName("");
      setEditTagColor("");
    }
  };

  const startEditingTag = (tag: Tag) => {
    setEditingTagId(tag.id);
    setEditTagName(tag.name);
    setEditTagColor(tag.color);
  };

  const cancelEditing = () => {
    setEditingTagId(null);
    setEditTagName("");
    setEditTagColor("");
  };

  const isTagSelected = (tagId: string) => selectedTags.some((t) => t.id === tagId);

  return (
    <div className="w-72 space-y-3">
      <h3 className="font-semibold text-sm">Etiquetas</h3>

      {/* Available Tags */}
      <div className="space-y-2">
        {availableTags.map((tag) => (
          <div key={tag.id}>
            {editingTagId === tag.id ? (
              <div className="space-y-2 rounded-lg border p-2">
                <Input
                  value={editTagName}
                  onChange={(e) => setEditTagName(e.target.value)}
                  placeholder="Nome da etiqueta"
                  autoFocus
                />
                <div className="grid grid-cols-3 gap-1">
                  {PRESET_COLORS.map((preset) => (
                    <button
                      key={preset.color}
                      onClick={() => setEditTagColor(preset.color)}
                      className="h-8 rounded hover:scale-105 transition-transform relative"
                      style={{ backgroundColor: preset.color }}
                      title={preset.name}
                    >
                      {editTagColor === preset.color && (
                        <Check className="h-4 w-4 text-white absolute inset-0 m-auto" />
                      )}
                    </button>
                  ))}
                </div>
                <div className="flex gap-1">
                  <Button
                    onClick={() => handleUpdateTag(tag.id)}
                    size="sm"
                    className="flex-1"
                  >
                    Salvar
                  </Button>
                  <Button onClick={cancelEditing} size="sm" variant="ghost">
                    Cancelar
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 group">
                <button
                  onClick={() =>
                    isTagSelected(tag.id) ? onRemoveTag(tag.id) : onAddTag(tag)
                  }
                  className="flex-1 flex items-center gap-2 rounded px-3 py-2 hover:opacity-80 transition-opacity"
                  style={{ backgroundColor: tag.color }}
                >
                  <span className="text-white font-medium text-sm flex-1 text-left">
                    {tag.name}
                  </span>
                  {isTagSelected(tag.id) && <Check className="h-4 w-4 text-white" />}
                </button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => startEditingTag(tag)}
                  className="opacity-0 group-hover:opacity-100"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDeleteTag(tag.id)}
                  className="opacity-0 group-hover:opacity-100 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Create New Tag */}
      {isCreating ? (
        <div className="space-y-2 rounded-lg border p-3">
          <Input
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            placeholder="Nome da etiqueta"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter") handleCreateTag();
              if (e.key === "Escape") setIsCreating(false);
            }}
          />
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">Selecione uma cor:</p>
            <div className="grid grid-cols-3 gap-2">
              {PRESET_COLORS.map((preset) => (
                <button
                  key={preset.color}
                  onClick={() => setNewTagColor(preset.color)}
                  className="h-10 rounded-md hover:scale-105 transition-transform relative flex items-center justify-center"
                  style={{ backgroundColor: preset.color }}
                  title={preset.name}
                >
                  {newTagColor === preset.color && (
                    <Check className="h-5 w-5 text-white" />
                  )}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleCreateTag} size="sm" className="flex-1">
              Criar
            </Button>
            <Button
              onClick={() => {
                setIsCreating(false);
                setNewTagName("");
                setNewTagColor(PRESET_COLORS[0].color);
              }}
              size="sm"
              variant="ghost"
            >
              Cancelar
            </Button>
          </div>
        </div>
      ) : (
        <Button
          onClick={() => setIsCreating(true)}
          variant="secondary"
          size="sm"
          className="w-full justify-start gap-2"
        >
          <Plus className="h-4 w-4" />
          Criar nova etiqueta
        </Button>
      )}
    </div>
  );
};
