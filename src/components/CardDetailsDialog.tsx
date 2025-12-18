import { useState, useRef } from "react";
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
  Tag as TagIcon,
  Paperclip,
  ArrowRight,
  Copy,
  Archive,
  Trash2,
} from "lucide-react";
import type { Card, ChecklistItem, Comment, Tag, Member, Board, Attachment } from "@/lib/store";
import { cn } from "@/lib/utils";
import { LabelsManager } from "./LabelsManager";
import { MembersManager } from "./MembersManager";
import { MoveCardDialog } from "./MoveCardDialog";

interface CardDetailsDialogProps {
  card: Card | null;
  listTitle: string;
  boardId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateCard: (cardId: string, updates: Partial<Card>) => void;
  onDeleteCard: (cardId: string) => void;
  onArchiveCard: (cardId: string) => void;
  onMoveCard: (targetBoardId: string, targetListId: string) => void;
  availableTags: Tag[];
  onCreateTag: (name: string, color: string) => void;
  onUpdateTag: (tagId: string, name: string, color: string) => void;
  onDeleteTag: (tagId: string) => void;
  onAddTagToCard: (tag: Tag) => void;
  onRemoveTagFromCard: (tagId: string) => void;
  availableMembers: Member[];
  onAddMemberToCard: (member: Member) => void;
  onRemoveMemberFromCard: (memberId: string) => void;
  allBoards: Board[];
  onMembersMentioned?: (members: Member[]) => void;
}

export const CardDetailsDialog = ({
  card,
  listTitle,
  boardId,
  open,
  onOpenChange,
  onUpdateCard,
  onDeleteCard,
  onArchiveCard,
  onMoveCard,
  availableTags,
  onCreateTag,
  onUpdateTag,
  onDeleteTag,
  onAddTagToCard,
  onRemoveTagFromCard,
  availableMembers,
  onAddMemberToCard,
  onRemoveMemberFromCard,
  allBoards,
  onMembersMentioned,
}: CardDetailsDialogProps) => {
  const [title, setTitle] = useState(card?.title || "");
  const [description, setDescription] = useState(card?.description || "");
  const [newChecklistItem, setNewChecklistItem] = useState("");
  const [newComment, setNewComment] = useState("");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const attachmentsInputRef = useRef<HTMLInputElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [selectedAttachment, setSelectedAttachment] = useState<Attachment | null>(null);
  const [isAttachmentPreviewOpen, setIsAttachmentPreviewOpen] = useState(false);
  const [editingAttachmentId, setEditingAttachmentId] = useState<string | null>(null);
  const [editingAttachmentName, setEditingAttachmentName] = useState("");

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

  const [isEditingDescription, setIsEditingDescription] = useState(false);

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
    const commentText = newComment.trim();

    const newCommentObj: Comment = {
      id: `cm${Date.now()}`,
      userId: "1",
      userName: "Ana Silva",
      userAvatar: "👩",
      text: commentText,
      createdAt: format(new Date(), "MMM d h:mm a", { locale: ptBR }),
    };

    const updatedComments = [...(card.comments || []), newCommentObj];
    onUpdateCard(card.id, { comments: updatedComments });

    // Detecta menções usando @Nome completo baseado nos membros disponíveis do quadro
    const mentionedMembers = availableMembers.filter((member) =>
      commentText.includes(`@${member.name}`)
    );

    if (mentionedMembers.length && onMembersMentioned) {
      onMembersMentioned(mentionedMembers);
    }

    setNewComment("");
  };

  const handleSetDueDate = (date: Date | undefined) => {
    onUpdateCard(card.id, { dueDate: date });
  };

  const getCoverType = () => {
    if (!card.coverImage) return "image";
    if (card.coverImage.startsWith("data:video")) return "video";
    if (card.coverImage.startsWith("data:audio")) return "audio";
    return "image";
  };

  const coverType = getCoverType();

  const handleFileUpload = async (file: File) => {
    if (
      !file.type.startsWith("image/") &&
      !file.type.startsWith("audio/") &&
      !file.type.startsWith("video/")
    ) {
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      onUpdateCard(card.id, { coverImage: base64String });
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFile(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFile(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFile(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleRemoveCover = () => {
    onUpdateCard(card.id, { coverImage: undefined });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto relative">
        {isAttachmentPreviewOpen && selectedAttachment && (
          <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center">
            <div className="relative max-w-3xl w-full max-h-[90vh] bg-background rounded-lg p-4 overflow-auto shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold break-words">
                    {selectedAttachment.name}
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    {Math.round(selectedAttachment.size / 1024)} KB
                  </p>
                </div>
                <div className="flex gap-2">
                  <a
                    href={selectedAttachment.url}
                    download={selectedAttachment.name}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Button variant="outline" size="sm">
                      Baixar
                    </Button>
                  </a>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setIsAttachmentPreviewOpen(false);
                      setSelectedAttachment(null);
                    }}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-center">
                {selectedAttachment.type.startsWith("image/") && (
                  <img
                    src={selectedAttachment.url}
                    alt={selectedAttachment.name}
                    className="max-h-[70vh] w-auto rounded-md object-contain"
                  />
                )}
                {selectedAttachment.type.startsWith("video/") && (
                  <video
                    src={selectedAttachment.url}
                    controls
                    className="max-h-[70vh] w-auto rounded-md"
                  />
                )}
                {selectedAttachment.type.startsWith("audio/") && (
                  <audio
                    src={selectedAttachment.url}
                    controls
                    className="w-full"
                  />
                )}
                {!selectedAttachment.type.startsWith("image/") &&
                  !selectedAttachment.type.startsWith("video/") &&
                  !selectedAttachment.type.startsWith("audio/") && (
                    <p className="text-sm text-muted-foreground">
                      Pré-visualização não disponível. Use o botão "Baixar" para abrir o arquivo.
                    </p>
                  )}
              </div>
            </div>
          </div>
        )}
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
                  na lista <span className="underline">{listTitle}</span>
                </p>
              </div>
            </div>

            {/* Cover Media (imagem, áudio ou vídeo) */}
            {card.coverImage ? (
              <div className="relative group">
                {coverType === "image" && (
                  <img
                    src={card.coverImage}
                    alt="Capa do card"
                    className="h-48 w-full rounded-lg object-cover"
                  />
                )}
                {coverType === "video" && (
                  <video
                    ref={videoRef}
                    src={card.coverImage}
                    className="h-48 w-full rounded-lg object-cover"
                    controls
                  />
                )}
                {coverType === "audio" && (
                  <div className="h-24 w-full rounded-lg bg-secondary flex items-center justify-center px-4">
                    <audio src={card.coverImage} controls className="w-full" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                  {coverType === "video" && (
                    <Button
                      onClick={() => {
                        if (!videoRef.current) return;
                        const video = videoRef.current;
                        const canvas = document.createElement("canvas");
                        const width = video.videoWidth || 640;
                        const height = video.videoHeight || 360;
                        canvas.width = width;
                        canvas.height = height;
                        const ctx = canvas.getContext("2d");
                        if (!ctx) return;
                        ctx.drawImage(video, 0, 0, width, height);
                        const dataUrl = canvas.toDataURL("image/png");
                        onUpdateCard(card.id, { coverImage: dataUrl });
                      }}
                      variant="secondary"
                      size="sm"
                    >
                      Usar frame atual como capa
                    </Button>
                  )}
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    variant="secondary"
                    size="sm"
                  >
                    Alterar
                  </Button>
                  <Button
                    onClick={handleRemoveCover}
                    variant="destructive"
                    size="sm"
                  >
                    Remover
                  </Button>
                </div>
              </div>
            ) : (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  isDraggingFile
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary hover:bg-secondary/50"
                }`}
              >
                <Paperclip className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Clique ou arraste uma imagem, áudio ou vídeo para adicionar capa
                </p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,audio/*,video/*"
              onChange={handleFileChange}
              className="hidden"
            />

            {/* Labels, Members, Due Date */}
            <div className="flex flex-wrap gap-4">
            {card.tags && card.tags.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-2">Etiquetas</p>
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
                  <p className="text-xs font-semibold text-muted-foreground mb-2">Membros</p>
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
                  <p className="text-xs font-semibold text-muted-foreground mb-2">Data de Vencimento</p>
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4" />
                    <span className="text-sm">
                      {format(card.dueDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <AlignLeft className="h-5 w-5" />
                <h3 className="font-semibold">Descrição</h3>
              </div>
              {isEditingDescription ? (
                <div className="space-y-2">
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Adicione uma descrição mais detalhada..."
                    className="min-h-[100px]"
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <Button onClick={handleSaveDescription} size="sm">
                      Salvar
                    </Button>
                    <Button
                      onClick={() => {
                        setDescription(card.description || "");
                        setIsEditingDescription(false);
                      }}
                      variant="ghost"
                      size="sm"
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => setIsEditingDescription(true)}
                  className="min-h-[60px] cursor-pointer rounded-md bg-secondary/50 p-3 hover:bg-secondary"
                >
                  {card.description || "Adicione uma descrição mais detalhada..."}
                </div>
              )}
            </div>

            {/* Attachments */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Paperclip className="h-5 w-5" />
                  <h3 className="font-semibold">Anexos</h3>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => attachmentsInputRef.current?.click()}
                >
                  Adicionar arquivos
                </Button>
              </div>
              <input
                ref={attachmentsInputRef}
                type="file"
                multiple
                onChange={(e) => {
                  const files = e.target.files;
                  if (!files?.length) return;

                  Array.from(files).forEach((file) => {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      const base64String = reader.result as string;
                      const newAttachment: Attachment = {
                        id: `att${Date.now()}-${Math.random().toString(16).slice(2)}`,
                        name: file.name,
                        type: file.type,
                        url: base64String,
                        size: file.size,
                        createdAt: new Date().toISOString(),
                      };
                      const updated = [...(card.attachments || []), newAttachment];
                      onUpdateCard(card.id, { attachments: updated });
                    };
                    reader.readAsDataURL(file);
                  });

                  // reset input to allow re-uploading same file
                  e.target.value = "";
                }}
                className="hidden"
              />

              {card.attachments && card.attachments.length > 0 ? (
                <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {card.attachments.map((attachment) => {
                    const isImage = attachment.type.startsWith("image/");
                    const isVideo = attachment.type.startsWith("video/");
                    const isAudio = attachment.type.startsWith("audio/");
                    const isEditing = editingAttachmentId === attachment.id;

                    return (
                      <div
                        key={attachment.id}
                        className="relative flex items-center gap-3 rounded-md border border-border bg-card p-2 text-left hover:border-primary focus-within:ring-2 focus-within:ring-primary/50"
                      >
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedAttachment(attachment);
                            setIsAttachmentPreviewOpen(true);
                          }}
                          className="flex items-center gap-3 flex-1 min-w-0 text-left"
                        >
                          <div className="h-12 w-12 flex items-center justify-center rounded-md bg-secondary overflow-hidden">
                            {isImage && (
                              <img
                                src={attachment.url}
                                alt={attachment.name}
                                className="h-full w-full object-cover"
                              />
                            )}
                            {isVideo && (
                              <span className="text-xs font-medium">Vídeo</span>
                            )}
                            {isAudio && (
                              <span className="text-xs font-medium">Áudio</span>
                            )}
                            {!isImage && !isVideo && !isAudio && (
                              <span className="text-xs font-medium">Arquivo</span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            {isEditing ? (
                              <div className="flex items-center gap-2">
                                <Input
                                  value={editingAttachmentName}
                                  onChange={(e) => setEditingAttachmentName(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      const trimmed = editingAttachmentName.trim();
                                      if (!trimmed) return;
                                      const updated = (card.attachments || []).map((a) =>
                                        a.id === attachment.id ? { ...a, name: trimmed } : a
                                      );
                                      onUpdateCard(card.id, { attachments: updated });
                                      setEditingAttachmentId(null);
                                    }
                                    if (e.key === "Escape") {
                                      setEditingAttachmentId(null);
                                    }
                                  }}
                                  autoFocus
                                  className="h-8 text-xs"
                                />
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => {
                                    const trimmed = editingAttachmentName.trim();
                                    if (!trimmed) {
                                      setEditingAttachmentId(null);
                                      return;
                                    }
                                    const updated = (card.attachments || []).map((a) =>
                                      a.id === attachment.id ? { ...a, name: trimmed } : a
                                    );
                                    onUpdateCard(card.id, { attachments: updated });
                                    setEditingAttachmentId(null);
                                  }}
                                >
                                  <CheckSquare className="h-3 w-3" />
                                </Button>
                              </div>
                            ) : (
                              <>
                                <p className="truncate text-sm font-medium">{attachment.name}</p>
                                <p className="text-xs text-muted-foreground truncate">
                                  {Math.round(attachment.size / 1024)} KB
                                </p>
                              </>
                            )}
                          </div>
                        </button>
                        <div className="flex items-center gap-1 ml-2">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="shrink-0"
                            onClick={() => {
                              setEditingAttachmentId(attachment.id);
                              setEditingAttachmentName(attachment.name);
                            }}
                          >
                            <AlignLeft className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="shrink-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              const updated = (card.attachments || []).filter(
                                (a) => a.id !== attachment.id
                              );
                              onUpdateCard(card.id, { attachments: updated });
                              if (selectedAttachment?.id === attachment.id) {
                                setSelectedAttachment(null);
                                setIsAttachmentPreviewOpen(false);
                              }
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Nenhum anexo ainda.</p>
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
                  placeholder="Adicionar um item..."
                  className="flex-1"
                />
                <Button onClick={handleAddChecklistItem} size="sm">
                  Adicionar
                </Button>
              </div>
            </div>

            {/* Comments */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <MessageSquare className="h-5 w-5" />
                <h3 className="font-semibold">Comentários</h3>
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
                      placeholder="Escrever um comentário..."
                      className="min-h-[80px]"
                    />
                    <Button onClick={handleAddComment} size="sm">
                      Enviar
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-48 shrink-0 space-y-6">
            <div>
              <h4 className="mb-2 text-xs font-semibold text-muted-foreground">Adicionar ao cartão</h4>
              <div className="space-y-1">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="secondary" size="sm" className="w-full justify-start gap-2">
                      <User className="h-4 w-4" />
                      Membros
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-3" align="start">
                    <MembersManager
                      availableMembers={availableMembers}
                      selectedMembers={card.members}
                      onAddMember={onAddMemberToCard}
                      onRemoveMember={onRemoveMemberFromCard}
                    />
                  </PopoverContent>
                </Popover>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="secondary" size="sm" className="w-full justify-start gap-2">
                      <TagIcon className="h-4 w-4" />
                      Etiquetas
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-3" align="start">
                    <LabelsManager
                      availableTags={availableTags}
                      selectedTags={card.tags}
                      onAddTag={onAddTagToCard}
                      onRemoveTag={onRemoveTagFromCard}
                      onCreateTag={onCreateTag}
                      onUpdateTag={onUpdateTag}
                      onDeleteTag={onDeleteTag}
                    />
                  </PopoverContent>
                </Popover>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="secondary" size="sm" className="w-full justify-start gap-2">
                      <CalendarIcon className="h-4 w-4" />
                      Data de Vencimento
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
                <Button 
                  variant="secondary" 
                  size="sm" 
                  className="w-full justify-start gap-2"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Paperclip className="h-4 w-4" />
                  Anexo
                </Button>
              </div>
            </div>

            <div>
              <h4 className="mb-2 text-xs font-semibold text-muted-foreground">Ações</h4>
              <div className="space-y-1">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="secondary" size="sm" className="w-full justify-start gap-2">
                      <ArrowRight className="h-4 w-4" />
                      Mover
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-3" align="start">
                    <MoveCardDialog
                      currentBoardId={boardId}
                      currentListId={card.listId}
                      allBoards={allBoards}
                      onMove={onMoveCard}
                      onClose={() => {}}
                    />
                  </PopoverContent>
                </Popover>
                <Button variant="secondary" size="sm" className="w-full justify-start gap-2">
                  <Copy className="h-4 w-4" />
                  Copiar
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
                  Arquivar
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
                  Excluir
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
