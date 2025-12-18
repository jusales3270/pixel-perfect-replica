import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  DragOverEvent,
} from "@dnd-kit/core";
import {
  ChevronLeft,
  Star,
  Users,
  MoreHorizontal,
  LayoutGrid,
  Calendar,
  BarChart3,
  Filter,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { store, Card } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";
import { KanbanColumn } from "@/components/KanbanColumn";
import { KanbanCard } from "@/components/KanbanCard";
import { CardDetailsDialog } from "@/components/CardDetailsDialog";

const BoardView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [board, setBoard] = useState(id ? store.getBoard(id) : undefined);
  const [activeCard, setActiveCard] = useState<Card | null>(null);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [isCardDialogOpen, setIsCardDialogOpen] = useState(false);
  const [newListTitle, setNewListTitle] = useState("");
  const [showNewListInput, setShowNewListInput] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      if (id) {
        setBoard(store.getBoard(id));
      }
    });
    return unsubscribe;
  }, [id]);

  if (!board) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold">Quadro não encontrado</h1>
          <Button onClick={() => navigate("/")}>Voltar para todos os quadros</Button>
        </div>
      </div>
    );
  }

  const handleDragStart = (event: DragStartEvent) => {
    const cardId = event.active.id as string;
    for (const list of board.lists) {
      const card = list.cards.find((c) => c.id === cardId);
      if (card) {
        setActiveCard(card);
        break;
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveCard(null);

    if (!over) return;

    const cardId = active.id as string;
    const newListId = over.id as string;

    // Adiciona uma pequena animação antes de mover
    setTimeout(() => {
      store.moveCard(cardId, newListId);
      const movedCard = board.lists.flatMap((l) => l.cards).find((c) => c.id === cardId);

      if (movedCard) {
        store.addNotification({
          type: "card_move",
          title: "Card movido entre listas",
          description: `"${movedCard.title}" foi movido para outra lista.`,
          boardId: board.id,
          cardId: movedCard.id,
        });
      }

      toast({
        title: "Card movido!",
        description: "O card foi movido para outra lista.",
        duration: 2000,
      });
    }, 100);
  };

  const handleToggleFavorite = () => {
    store.toggleFavorite(board.id);
    toast({
      title: board.isFavorite ? "Removido dos favoritos" : "Adicionado aos favoritos",
    });
  };

  const handleAddList = () => {
    if (!newListTitle.trim()) return;
    store.addList(board.id, newListTitle.trim());
    setNewListTitle("");
    setShowNewListInput(false);
    toast({
      title: "Lista criada!",
      description: `A lista "${newListTitle}" foi adicionada.`,
    });
  };

  const handleAddCard = (listId: string, title: string) => {
    const newCard = store.addCard(listId, title);
    if (newCard) {
      store.addNotification({
        type: "card_move",
        title: "Novo card criado",
        description: `"${newCard.title}" foi criado na lista.`,
        boardId: board.id,
        cardId: newCard.id,
      });
    }

    toast({
      title: "Cartão criado!",
    });
  };

  const handleDeleteCard = (cardId: string) => {
    const card = board.lists.flatMap((l) => l.cards).find((c) => c.id === cardId);
    store.deleteCard(cardId);

    if (card) {
      store.addNotification({
        type: "card_move",
        title: "Card excluído",
        description: `"${card.title}" foi removido do quadro.`,
        boardId: board.id,
        cardId: card.id,
      });
    }

    toast({
      title: "Cartão excluído",
    });
  };

  const handleDuplicateCard = (cardId: string) => {
    const duplicatedCard = store.duplicateCard(cardId);
    if (duplicatedCard) {
      store.addNotification({
        type: "card_move",
        title: "Card duplicado",
        description: `"${duplicatedCard.title}" foi criado.`,
        boardId: board.id,
        cardId: duplicatedCard.id,
      });

      toast({
        title: "Card duplicado!",
        description: `"${duplicatedCard.title}" foi criado.`,
      });
    }
  };

  const handleCardClick = (card: Card) => {
    setSelectedCard(card);
    setIsCardDialogOpen(true);
  };

  const handleUpdateCard = (cardId: string, updates: Partial<Card>) => {
    store.updateCard(cardId, updates);
    // Update selected card to reflect changes
    if (selectedCard?.id === cardId) {
      const updatedCard = board?.lists
        .flatMap((list) => list.cards)
        .find((c) => c.id === cardId);
      if (updatedCard) {
        setSelectedCard(updatedCard);
      }
    }
  };

  const handleArchiveCard = (cardId: string) => {
    const card = board.lists.flatMap((l) => l.cards).find((c) => c.id === cardId);
    store.archiveCard(cardId);

    if (card) {
      store.addNotification({
        type: "card_move",
        title: "Card arquivado",
        description: `"${card.title}" foi arquivado.`,
        boardId: board.id,
        cardId: card.id,
      });
    }

    toast({
      title: "Card arquivado",
    });
  };

  return (
    <div
      className="flex min-h-screen flex-col"
      style={{
        background: `linear-gradient(135deg, ${board.color} 0%, ${board.color}dd 100%)`,
      }}
    >
      {/* Board Header */}
      <header className="border-b border-white/20 bg-black/10 px-6 py-4 backdrop-blur-sm">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                <ChevronLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-white">{board.title}</h1>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleToggleFavorite}
              className="text-white hover:bg-white/20"
            >
              <Star
                className={`h-5 w-5 ${
                  board.isFavorite ? "fill-white" : ""
                }`}
              />
            </Button>
            <div className="flex -space-x-2">
              {board.members.slice(0, 5).map((member) => (
                <Avatar key={member.id} className="h-8 w-8 border-2 border-white">
                  <AvatarFallback className="text-xs">{member.avatar}</AvatarFallback>
                </Avatar>
              ))}
            </div>
            <Button variant="ghost" className="gap-2 text-white hover:bg-white/20">
              <Users className="h-4 w-4" />
              Convidar
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" className="gap-2 text-white hover:bg-white/20">
              <LayoutGrid className="h-4 w-4" />
              Quadro
            </Button>
            <Button variant="ghost" className="gap-2 text-white hover:bg-white/20">
              <Calendar className="h-4 w-4" />
              Calendário
            </Button>
            <Button variant="ghost" className="gap-2 text-white hover:bg-white/20">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </Button>
            <Button variant="ghost" className="gap-2 text-white hover:bg-white/20">
              <Filter className="h-4 w-4" />
              Filtro
            </Button>
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Kanban Board */}
      <main className="flex-1 overflow-x-auto p-6">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-4 pb-6">
            {board.lists.map((list) => (
              <KanbanColumn
                key={list.id}
                list={list}
                onAddCard={handleAddCard}
                onDeleteCard={handleDeleteCard}
                onDuplicateCard={handleDuplicateCard}
                onCardClick={handleCardClick}
              />
            ))}

            {/* Add List Button */}
            {showNewListInput ? (
              <div className="w-80 shrink-0 rounded-xl bg-white/90 p-4 shadow-lg backdrop-blur-sm">
                <Input
                  autoFocus
                  value={newListTitle}
                  onChange={(e) => setNewListTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAddList();
                    if (e.key === "Escape") setShowNewListInput(false);
                  }}
                  placeholder="Digite o nome da lista..."
                  className="mb-2"
                />
                <div className="flex gap-2">
                  <Button onClick={handleAddList} size="sm">
                    Adicionar
                  </Button>
                  <Button
                    onClick={() => setShowNewListInput(false)}
                    variant="ghost"
                    size="sm"
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowNewListInput(true)}
                className="flex w-80 shrink-0 items-center gap-2 rounded-xl bg-white/20 p-4 text-white backdrop-blur-sm transition-colors hover:bg-white/30"
              >
                <Plus className="h-5 w-5" />
                <span className="font-medium">Adicionar outra lista</span>
              </button>
            )}
          </div>

          <DragOverlay
            dropAnimation={{
              duration: 300,
              easing: "cubic-bezier(0.34, 1.56, 0.64, 1)",
            }}
          >
            {activeCard ? (
              <div className="rotate-3 scale-105 opacity-95 cursor-grabbing shadow-2xl">
                <KanbanCard card={activeCard} />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>

        <CardDetailsDialog
          card={selectedCard}
          listTitle={
            board.lists.find((list) => list.id === selectedCard?.listId)?.title || ""
          }
          boardId={board.id}
          open={isCardDialogOpen}
          onOpenChange={setIsCardDialogOpen}
          onUpdateCard={handleUpdateCard}
          onDeleteCard={handleDeleteCard}
          onArchiveCard={handleArchiveCard}
          onMoveCard={(targetBoardId, targetListId) => {
            if (selectedCard) {
              store.moveCard(selectedCard.id, targetListId, targetBoardId);
              setIsCardDialogOpen(false);
              
              const destinationBoard = store.getBoard(targetBoardId);

              store.addNotification({
                type: "card_move",
                title: "Card movido",
                description:
                  targetBoardId !== board.id && destinationBoard
                    ? `"${selectedCard.title}" foi movido para o quadro "${destinationBoard.title}".`
                    : `"${selectedCard.title}" foi movido para outra lista.`,
                boardId: targetBoardId,
                cardId: selectedCard.id,
              });
              
              // If moving to another board, navigate to it
              if (targetBoardId !== board.id) {
                toast({
                  title: "Card movido!",
                  description: "O card foi movido para outro quadro.",
                });
                navigate(`/board/${targetBoardId}`);
              } else {
                toast({
                  title: "Card movido!",
                  description: "O card foi movido para outra lista.",
                });
              }
            }
          }}
          availableTags={board.availableTags}
          onCreateTag={(name, color) => {
            const newTag = store.addBoardTag(board.id, name, color);
            if (newTag) {
              toast({
                title: "Etiqueta criada!",
                description: `A etiqueta "${name}" foi criada.`,
              });
            }
          }}
          onUpdateTag={(tagId, name, color) => {
            store.updateBoardTag(board.id, tagId, { name, color });
            toast({
              title: "Etiqueta atualizada!",
            });
          }}
          onDeleteTag={(tagId) => {
            store.deleteBoardTag(board.id, tagId);
            toast({
              title: "Etiqueta excluída!",
            });
          }}
          onAddTagToCard={(tag) => {
            if (selectedCard) {
              store.addTagToCard(selectedCard.id, tag);
            }
          }}
          onRemoveTagFromCard={(tagId) => {
            if (selectedCard) {
              store.removeTagFromCard(selectedCard.id, tagId);
            }
          }}
          availableMembers={board.members}
          onAddMemberToCard={(member) => {
            if (selectedCard) {
              store.addMemberToCard(selectedCard.id, member);
              store.addNotification({
                type: "assignment",
                title: "Membro atribuído a um card",
                description: `${member.name} foi adicionado ao cartão "${selectedCard.title}".`,
                boardId: board.id,
                cardId: selectedCard.id,
              });

              toast({
                title: "Membro adicionado!",
                description: `${member.name} foi adicionado ao cartão.`,
              });
            }
          }}
          onRemoveMemberFromCard={(memberId) => {
            if (selectedCard) {
              const member = board.members.find((m) => m.id === memberId);
              store.removeMemberFromCard(selectedCard.id, memberId);

              if (member) {
                store.addNotification({
                  type: "assignment",
                  title: "Membro removido de um card",
                  description: `${member.name} foi removido do cartão "${selectedCard.title}".`,
                  boardId: board.id,
                  cardId: selectedCard.id,
                });
              }

              toast({
                title: "Membro removido!",
              });
            }
          }}
          allBoards={store.getBoards()}
          onMembersMentioned={(members) => {
            if (!members.length || !selectedCard) return;

            const names = members.map((m) => m.name).join(", ");

            store.addNotification({
              type: "mention",
              title:
                members.length === 1
                  ? "Membro mencionado em um comentário"
                  : "Membros mencionados em um comentário",
              description: names,
              boardId: board.id,
              cardId: selectedCard.id,
            });

            toast({
              title:
                members.length === 1
                  ? "Membro mencionado em um comentário"
                  : "Membros mencionados em um comentário",
              description: names,
            });
          }}
        />
      </main>
    </div>
  );
};

export default BoardView;
