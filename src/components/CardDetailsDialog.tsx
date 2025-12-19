import { useState } from "react";
import { X, AlignLeft, CheckSquare, MessageSquare, Paperclip, Archive, Trash2, Copy, MoveRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import type { Card } from "@/lib/store";

interface CardDetailsDialogProps {
  card: Card;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  listTitle: string;
  onUpdateCard: (cardId: string, updates: Partial<Card>) => void;
  onDeleteCard: (cardId: string) => void;
  onDuplicateCard: (cardId: string) => void;
}

export const CardDetailsDialog = ({
  card,
  open,
  onOpenChange,
  listTitle,
  onUpdateCard,
  onDeleteCard,
  onDuplicateCard,
}: CardDetailsDialogProps) => {
  const [editingTitle, setEditingTitle] = useState(false);
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description || "");
  const [newChecklistItem, setNewChecklistItem] = useState("");
  const [comment, setComment] = useState("");

  const completedChecklist = card.checklist?.filter((item) => item.completed).length || 0;
  const totalChecklist = card.checklist?.length || 0;

  const handleSaveTitle = () => {
    if (title.trim() && title !== card.title) {
      onUpdateCard(card.id, { title: title.trim() });
    }
    setEditingTitle(false);
  };

  const handleSaveDescription = () => {
    onUpdateCard(card.id, { description });
  };

  const handleToggleChecklistItem = (itemId: string) => {
    const updatedChecklist = card.checklist?.map((item) =>
      item.id === itemId ? { ...item, completed: !item.completed } : item
    );
    onUpdateCard(card.id, { checklist: updatedChecklist });
  };

  const handleAddChecklistItem = () => {
    if (!newChecklistItem.trim()) return;
    const newItem = {
      id: `ch${Date.now()}`,
      text: newChecklistItem.trim(),
      completed: false,
    };
    const updatedChecklist = [...(card.checklist || []), newItem];
    onUpdateCard(card.id, { checklist: updatedChecklist });
    setNewChecklistItem("");
  };

  const handleDeleteChecklistItem = (itemId: string) => {
    const updatedChecklist = card.checklist?.filter((item) => item.id !== itemId);
    onUpdateCard(card.id, { checklist: updatedChecklist });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        <div className="flex">
          {/* Main Content */}
          <div className="flex-1 p-6">
            {/* Cover Image */}
            {card.coverImage && (
              <img
                src={card.coverImage}
                alt={card.title}
                className="-mx-6 -mt-6 mb-4 h-40 w-[calc(100%+3rem)] object-cover"
              />
            )}

            {/* Header */}
            <DialogHeader className="space-y-3">
              <div className="flex items-start gap-3">
                <AlignLeft className="h-5 w-5 mt-1 text-muted-foreground" />
                <div className="flex-1">
                  {editingTitle ? (
                    <Input
                      autoFocus
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      onBlur={handleSaveTitle}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSaveTitle();
                        if (e.key === "Escape") {
                          setTitle(card.title);
                          setEditingTitle(false);
                        }
                      }}
                      className="text-xl font-semibold"
                    />
                  ) : (
                    <h2
                      className="text-xl font-semibold cursor-pointer hover:bg-muted px-2 py-1 rounded -ml-2"
                      onClick={() => setEditingTitle(true)}
                    >
                      {card.title}
                    </h2>
                  )}
                  <p className="text-sm text-muted-foreground mt-1">
                    in list <span className="underline">{listTitle}</span>
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onOpenChange(false)}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </DialogHeader>

            {/* Labels, Members, Due Date */}
            <div className="mt-6 flex flex-wrap gap-6">
              {card.tags && card.tags.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-2">Labels</p>
                  <div className="flex flex-wrap gap-1">
                    {card.tags.map((tag) => (
                      <span
                        key={tag.id}
                        className="rounded px-3 py-1 text-sm font-medium text-white"
                        style={{ backgroundColor: tag.color }}
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {card.members && card.members.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-2">Members</p>
                  <div className="flex -space-x-2">
                    {card.members.map((member) => (
                      <Avatar key={member.id} className="h-8 w-8 border-2 border-background">
                        <AvatarFallback className="text-sm">{member.avatar}</AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                </div>
              )}

              {card.dueDate && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-2">Due Date</p>
                  <div className="flex items-center gap-2 rounded bg-muted px-3 py-1">
                    <span className="text-sm">{card.dueDate}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="mt-6">
              <div className="flex items-center gap-3 mb-3">
                <AlignLeft className="h-5 w-5 text-muted-foreground" />
                <h3 className="font-semibold">Description</h3>
              </div>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onBlur={handleSaveDescription}
                placeholder="Add a more detailed description..."
                className="min-h-[100px] resize-none"
              />
            </div>

            {/* Checklist */}
            {(card.checklist && card.checklist.length > 0) || newChecklistItem ? (
              <div className="mt-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <CheckSquare className="h-5 w-5 text-muted-foreground" />
                    <h3 className="font-semibold">Checklist</h3>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {completedChecklist}/{totalChecklist}
                  </span>
                </div>

                {/* Progress Bar */}
                {totalChecklist > 0 && (
                  <div className="mb-4 h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{
                        width: `${(completedChecklist / totalChecklist) * 100}%`,
                      }}
                    />
                  </div>
                )}

                {/* Checklist Items */}
                <div className="space-y-2 mb-3">
                  {card.checklist?.map((item) => (
                    <div key={item.id} className="flex items-center gap-2 group">
                      <Checkbox
                        checked={item.completed}
                        onCheckedChange={() => handleToggleChecklistItem(item.id)}
                      />
                      <span
                        className={`flex-1 text-sm ${
                          item.completed ? "line-through text-muted-foreground" : ""
                        }`}
                      >
                        {item.text}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 opacity-0 group-hover:opacity-100"
                        onClick={() => handleDeleteChecklistItem(item.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>

                {/* Add Checklist Item */}
                <div className="flex gap-2">
                  <Input
                    value={newChecklistItem}
                    onChange={(e) => setNewChecklistItem(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleAddChecklistItem();
                    }}
                    placeholder="Add an item..."
                    className="flex-1"
                  />
                  <Button onClick={handleAddChecklistItem} size="sm">
                    Add
                  </Button>
                </div>
              </div>
            ) : null}

            {/* Comments */}
            <div className="mt-6">
              <div className="flex items-center gap-3 mb-3">
                <MessageSquare className="h-5 w-5 text-muted-foreground" />
                <h3 className="font-semibold">Comments</h3>
              </div>
              <div className="space-y-3">
                <Textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Write a comment..."
                  className="min-h-[80px] resize-none"
                />
                <Button
                  onClick={() => {
                    if (comment.trim()) {
                      // TODO: Implement comment functionality
                      setComment("");
                    }
                  }}
                  size="sm"
                >
                  Send
                </Button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-48 border-l bg-muted/30 p-4">
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground mb-3">Add to card</p>
              <Button variant="ghost" className="w-full justify-start gap-2" size="sm">
                <Avatar className="h-4 w-4">
                  <AvatarFallback className="text-[10px]">M</AvatarFallback>
                </Avatar>
                Members
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-2" size="sm">
                <div className="h-4 w-4 rounded bg-primary" />
                Labels
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-2" size="sm">
                <CheckSquare className="h-4 w-4" />
                Checklist
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-2" size="sm">
                <Paperclip className="h-4 w-4" />
                Attachment
              </Button>

              <Separator className="my-3" />

              <p className="text-xs font-semibold text-muted-foreground mb-3">Actions</p>
              <Button variant="ghost" className="w-full justify-start gap-2" size="sm">
                <MoveRight className="h-4 w-4" />
                Move
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start gap-2"
                size="sm"
                onClick={() => {
                  onDuplicateCard(card.id);
                  onOpenChange(false);
                }}
              >
                <Copy className="h-4 w-4" />
                Copy
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-2" size="sm">
                <Archive className="h-4 w-4" />
                Archive
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 text-destructive hover:text-destructive"
                size="sm"
                onClick={() => {
                  onDeleteCard(card.id);
                  onOpenChange(false);
                }}
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
