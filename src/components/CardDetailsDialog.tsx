import { useState } from "react";
import { X, AlignLeft, CheckSquare, MessageSquare, Paperclip, Archive, Trash2, Copy, Users } from "lucide-react";
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
import { AddMemberDialog } from "./AddMemberDialog";
import { AddLabelDialog } from "./AddLabelDialog";
import { AttachmentUpload } from "./AttachmentUpload";
import { MoveCardDialog } from "./MoveCardDialog";
import type { Card, Member, Tag, Attachment, List } from "@/lib/store";

interface CardDetailsDialogProps {
  card: Card;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  listTitle: string;
  boardMembers: Member[];
  availableLists: List[];
  onUpdateCard: (cardId: string, updates: Partial<Card>) => void;
  onDeleteCard: (cardId: string) => void;
  onDuplicateCard: (cardId: string) => void;
  onAddMember: (cardId: string, member: Member) => void;
  onRemoveMember: (cardId: string, memberId: string) => void;
  onAddTag: (cardId: string, tag: Tag) => void;
  onRemoveTag: (cardId: string, tagId: string) => void;
  onAddAttachment: (cardId: string, attachment: Attachment) => void;
  onRemoveAttachment: (cardId: string, attachmentId: string) => void;
  onMoveCard: (cardId: string, newListId: string) => void;
  onArchiveCard: (cardId: string) => void;
}

export const CardDetailsDialog = ({
  card,
  open,
  onOpenChange,
  listTitle,
  boardMembers,
  availableLists,
  onUpdateCard,
  onDeleteCard,
  onDuplicateCard,
  onAddMember,
  onRemoveMember,
  onAddTag,
  onRemoveTag,
  onAddAttachment,
  onRemoveAttachment,
  onMoveCard,
  onArchiveCard,
}: CardDetailsDialogProps) => {
  const [editingTitle, setEditingTitle] = useState(false);
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description || "");
  const [newChecklistItem, setNewChecklistItem] = useState("");

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
            <div className="mt-6 space-y-4">
              {/* Members */}
              {card.members && card.members.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-semibold text-muted-foreground">Members</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 text-xs"
                      onClick={() => {}}
                    >
                      <Users className="h-3 w-3 mr-1" />
                      Manage
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {card.members.map((member) => (
                      <div key={member.id} className="group relative">
                        <Avatar className="h-8 w-8 border-2 border-background">
                          <AvatarFallback className="text-sm">{member.avatar}</AvatarFallback>
                        </Avatar>
                        <button
                          onClick={() => onRemoveMember(card.id, member.id)}
                          className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Labels */}
              {card.tags && card.tags.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-2">Labels</p>
                  <div className="flex flex-wrap gap-1">
                    {card.tags.map((tag) => (
                      <div key={tag.id} className="group relative">
                        <span
                          className="rounded px-3 py-1 text-sm font-medium text-white"
                          style={{ backgroundColor: tag.color }}
                        >
                          {tag.name}
                        </span>
                        <button
                          onClick={() => onRemoveTag(card.id, tag.id)}
                          className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Due Date */}
              {card.dueDate && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-2">Due Date</p>
                  <div className="flex items-center gap-2 rounded bg-muted px-3 py-1 w-fit">
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

            {/* Attachments */}
            <div className="mt-6">
              <div className="flex items-center gap-3 mb-3">
                <Paperclip className="h-5 w-5 text-muted-foreground" />
                <h3 className="font-semibold">Attachments</h3>
              </div>
              <AttachmentUpload
                cardId={card.id}
                attachments={card.attachments || []}
                onAttachmentAdded={(attachment) => onAddAttachment(card.id, attachment)}
                onAttachmentRemoved={(attachmentId) => onRemoveAttachment(card.id, attachmentId)}
              />
            </div>

            {/* Checklist */}
            {(card.checklist && card.checklist.length > 0) || newChecklistItem !== "" ? (
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
                {card.comments && card.comments.length > 0 && (
                  <div className="space-y-3 mb-4">
                    {card.comments.map((comment) => (
                      <div key={comment.id} className="flex gap-3 p-3 bg-muted rounded-lg">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">{comment.authorAvatar}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium">{comment.authorName}</span>
                            <span className="text-xs text-muted-foreground">{comment.createdAt}</span>
                          </div>
                          <p className="text-sm">{comment.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <Textarea
                  placeholder="Write a comment..."
                  className="min-h-[80px] resize-none"
                />
                <Button size="sm">Send</Button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-48 border-l bg-muted/30 p-4">
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground mb-3">Add to card</p>
              
              <AddMemberDialog
                availableMembers={boardMembers}
                selectedMembers={card.members || []}
                onAddMember={(member) => onAddMember(card.id, member)}
              />

              <AddLabelDialog
                onAddLabel={(tag) => onAddTag(card.id, tag)}
              />

              <Button
                variant="ghost"
                className="w-full justify-start gap-2"
                size="sm"
                onClick={() => {
                  const updatedChecklist = [...(card.checklist || [])];
                  if (updatedChecklist.length === 0) {
                    updatedChecklist.push({
                      id: `ch${Date.now()}`,
                      text: "",
                      completed: false,
                    });
                  }
                  onUpdateCard(card.id, { checklist: updatedChecklist });
                  setNewChecklistItem("");
                }}
              >
                <CheckSquare className="h-4 w-4" />
                Checklist
              </Button>

              <Separator className="my-3" />

              <p className="text-xs font-semibold text-muted-foreground mb-3">Actions</p>
              
              <MoveCardDialog
                currentListId={card.listId}
                availableLists={availableLists}
                onMove={(newListId) => {
                  onMoveCard(card.id, newListId);
                  onOpenChange(false);
                }}
              />

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

              <Button
                variant="ghost"
                className="w-full justify-start gap-2"
                size="sm"
                onClick={() => {
                  onArchiveCard(card.id);
                  onOpenChange(false);
                }}
              >
                <Archive className="h-4 w-4" />
                {card.archived ? "Unarchive" : "Archive"}
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
