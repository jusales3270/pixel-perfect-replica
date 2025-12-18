import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Progress } from "./ui/progress";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
  X,
  CreditCard,
  AlignLeft,
  CheckSquare,
  MessageSquare,
  Calendar as CalendarIcon,
  User,
  Tag,
  Paperclip,
  ArrowRight,
  Copy,
  Archive,
  Trash2,
} from "lucide-react";
import type { Card, ChecklistItem, Comment } from "@/lib/store";
import { cn } from "@/lib/utils";

interface CardDetailsDialogProps {
  card: Card | null;
  listTitle: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateCard: (cardId: string, updates: Partial<Card>) => void;
  onDeleteCard: (cardId: string) => void;
  onArchiveCard: (cardId: string) => void;
}

export const CardDetailsDialog = ({
  card,
  listTitle,
  open,
  onOpenChange,
  onUpdateCard,
  onDeleteCard,
  onArchiveCard,
}: CardDetailsDialogProps) => {
  const [title, setTitle] = useState(card?.title || "");
  const [description, setDescription] = useState(card?.description || "");
  const [newChecklistItem, setNewChecklistItem] = useState("");
  const [newComment, setNewComment] = useState("");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);

  if (!card) return null;

  const completedItems = card.checklist?.filter((item) => item.completed).length || 0;
  const totalItems = card.checklist?.length || 0;
  const progress = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

  const handleSaveTitle = () => {
    if (title.trim() && title !== card.title) {
      onUpdateCard(card.id, { title: title.trim() });
    }
    setIsEditingTitle(false);
  };

  const handleSaveDescription = () => {
    if (description !== card.description) {
      onUpdateCard(card.id, { description: description.trim() });
    }
    setIsEditingDescription(false);
  };

  const handleToggleChecklistItem = (itemId: string) => {
    const updatedChecklist = card.checklist?.map((item) =>
      item.id === itemId ? { ...item, completed: !item.completed } : item
    );
    onUpdateCard(card.id, { checklist: updatedChecklist });
  };

  const handleAddChecklistItem = () => {
    if (!newChecklistItem.trim()) return;
    const newItem: ChecklistItem = {
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

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    const newCommentObj: Comment = {
      id: `cm${Date.now()}`,
      userId: "1",
      userName: "Ana Silva",
      userAvatar: "👩",
      text: newComment.trim(),
      createdAt: format(new Date(), "MMM d h:mm a", { locale: ptBR }),
    };
    const updatedComments = [...(card.comments || []), newCommentObj];
    onUpdateCard(card.id, { comments: updatedComments });
    setNewComment("");
  };

  const handleSetDueDate = (date: Date | undefined) => {
    onUpdateCard(card.id, { dueDate: date });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex gap-6">
          {/* Main Content */}
          <div className="flex-1 space-y-6">
            {/* Header */}
            <div className="flex items-start gap-3">
              <CreditCard className="h-6 w-6 text-foreground mt-1" />
              <div className="flex-1">
                {isEditingTitle ? (
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onBlur={handleSaveTitle}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSaveTitle();
                      if (e.key === "Escape") {
                        setTitle(card.title);
                        setIsEditingTitle(false);
                      }
                    }}
                    autoFocus
                    className="text-xl font-semibold"
                  />
                ) : (
                  <h2
                    onClick={() => setIsEditingTitle(true)}
                    className="text-xl font-semibold cursor-pointer hover:bg-secondary/50 rounded px-2 py-1 -mx-2"
                  >
                    {card.title}
                  </h2>
                )}
                <p className="text-sm text-muted-foreground mt-1">
                  in list <span className="underline">{listTitle}</span>
                </p>
              </div>
            </div>

            {/* Labels, Members, Due Date */}
            <div className="flex flex-wrap gap-4">
              {card.tags && card.tags.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-2">Labels</p>
                  <div className="flex flex-wrap gap-1">
                    {card.tags.map((tag) => (
                      <span
                        key={tag.id}
                        className="rounded px-3 py-1 text-xs font-medium text-white"
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
                        <AvatarFallback>{member.avatar}</AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                </div>
              )}

              {card.dueDate && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-2">Due Date</p>
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4" />
                    <span className="text-sm">
                      {format(card.dueDate, "MMM dd, yyyy", { locale: ptBR })}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <AlignLeft className="h-5 w-5" />
                <h3 className="font-semibold">Description</h3>
              </div>
              {isEditingDescription ? (
                <div className="space-y-2">
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Add a more detailed description..."
                    className="min-h-[100px]"
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <Button onClick={handleSaveDescription} size="sm">
                      Save
                    </Button>
                    <Button
                      onClick={() => {
                        setDescription(card.description || "");
                        setIsEditingDescription(false);
                      }}
                      variant="ghost"
                      size="sm"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => setIsEditingDescription(true)}
                  className="min-h-[60px] cursor-pointer rounded-md bg-secondary/50 p-3 hover:bg-secondary"
                >
                  {card.description || "Add a more detailed description..."}
                </div>
              )}
            </div>

            {/* Checklist */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <CheckSquare className="h-5 w-5" />
                  <h3 className="font-semibold">Checklist</h3>
                </div>
                {totalItems > 0 && (
                  <span className="text-xs text-muted-foreground">
                    {completedItems}/{totalItems}
                  </span>
                )}
              </div>

              {totalItems > 0 && (
                <Progress value={progress} className="mb-4 h-2" />
              )}

              <div className="space-y-2">
                {card.checklist?.map((item) => (
                  <div key={item.id} className="flex items-center gap-2 group">
                    <input
                      type="checkbox"
                      checked={item.completed}
                      onChange={() => handleToggleChecklistItem(item.id)}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <span
                      className={cn(
                        "flex-1 text-sm",
                        item.completed && "line-through text-muted-foreground"
                      )}
                    >
                      {item.text}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100"
                      onClick={() => handleDeleteChecklistItem(item.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <div className="mt-3 flex gap-2">
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

            {/* Comments */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <MessageSquare className="h-5 w-5" />
                <h3 className="font-semibold">Comments</h3>
              </div>

              <div className="space-y-4">
                {card.comments?.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{comment.userAvatar}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm">{comment.userName}</span>
                        <span className="text-xs text-muted-foreground">{comment.createdAt}</span>
                      </div>
                      <div className="rounded-md bg-secondary p-3 text-sm">{comment.text}</div>
                    </div>
                  </div>
                ))}

                <div className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>👩</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-2">
                    <Textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Write a comment..."
                      className="min-h-[80px]"
                    />
                    <Button onClick={handleAddComment} size="sm">
                      Send
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-48 shrink-0 space-y-6">
            <div>
              <h4 className="mb-2 text-xs font-semibold text-muted-foreground">Add to card</h4>
              <div className="space-y-1">
                <Button variant="secondary" size="sm" className="w-full justify-start gap-2">
                  <User className="h-4 w-4" />
                  Members
                </Button>
                <Button variant="secondary" size="sm" className="w-full justify-start gap-2">
                  <Tag className="h-4 w-4" />
                  Labels
                </Button>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="secondary" size="sm" className="w-full justify-start gap-2">
                      <CalendarIcon className="h-4 w-4" />
                      Due Date
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={card.dueDate}
                      onSelect={handleSetDueDate}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                <Button variant="secondary" size="sm" className="w-full justify-start gap-2">
                  <Paperclip className="h-4 w-4" />
                  Attachment
                </Button>
              </div>
            </div>

            <div>
              <h4 className="mb-2 text-xs font-semibold text-muted-foreground">Actions</h4>
              <div className="space-y-1">
                <Button variant="secondary" size="sm" className="w-full justify-start gap-2">
                  <ArrowRight className="h-4 w-4" />
                  Move
                </Button>
                <Button variant="secondary" size="sm" className="w-full justify-start gap-2">
                  <Copy className="h-4 w-4" />
                  Copy
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  className="w-full justify-start gap-2"
                  onClick={() => {
                    onArchiveCard(card.id);
                    onOpenChange(false);
                  }}
                >
                  <Archive className="h-4 w-4" />
                  Archive
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  className="w-full justify-start gap-2 text-destructive hover:bg-destructive hover:text-destructive-foreground"
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
        </div>
      </DialogContent>
    </Dialog>
  );
};
