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
  ChevronRight,
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
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { store, Card } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";
import { KanbanColumn } from "@/components/KanbanColumn";
import { KanbanCard } from "@/components/KanbanCard";
import { CardDetailsDialog } from "@/components/CardDetailsDialog";
import {
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

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
  const [viewMode, setViewMode] = useState<"board" | "calendar" | "analytics">("board");
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [filters, setFilters] = useState({
    search: "",
    tags: [] as string[],
    members: [] as string[],
    status: "all" as "all" | "completed" | "overdue" | "without_due_date",
  });

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

  const isCardVisible = (card: Card) => {
    const normalizedSearch = filters.search.trim().toLowerCase();
    const today = new Date();

    if (normalizedSearch && !card.title.toLowerCase().includes(normalizedSearch)) {
      return false;
    }

    if (filters.tags.length) {
      const cardTags = card.tags || [];
      const hasAnyTag = cardTags.some((tag) => filters.tags.includes(tag.id));
      if (!hasAnyTag) return false;
    }

    if (filters.members.length) {
      const cardMembers = card.members || [];
      const hasAnyMember = cardMembers.some((member) => filters.members.includes(member.id));
      if (!hasAnyMember) return false;
    }

    const checklist = card.checklist || [];
    const isCompleted = checklist.length > 0 && checklist.every((item) => item.completed);
    const hasDueDate = Boolean(card.dueDate);
    const isOverdue = hasDueDate && card.dueDate! < today && !isCompleted;

    if (filters.status === "completed" && !isCompleted) return false;
    if (filters.status === "overdue" && !isOverdue) return false;
    if (filters.status === "without_due_date" && hasDueDate) return false;

    return true;
  };

  const filteredLists =
    viewMode === "board"
      ? board.lists.map((list) => ({
          ...list,
          cards: list.cards.filter(isCardVisible),
        }))
      : board.lists;

  return (
    <div
       className="flex min-h-screen flex-col"
       style={{
         background: `linear-gradient(135deg, ${board.color} 0%, ${board.color} 100%)`,
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
            <Button
              variant="ghost"
              className={`gap-2 text-white hover:bg-white/20 ${
                viewMode === "board" ? "bg-white/20" : ""
              }`}
              onClick={() => setViewMode("board")}
            >
              <LayoutGrid className="h-4 w-4" />
              Quadro
            </Button>
            <Button
              variant="ghost"
              className={`gap-2 text-white hover:bg-white/20 ${
                viewMode === "calendar" ? "bg-white/20" : ""
              }`}
              onClick={() => setViewMode("calendar")}
            >
              <Calendar className="h-4 w-4" />
              Calendário
            </Button>
            <Button
              variant="ghost"
              className={`gap-2 text-white hover:bg-white/20 ${
                viewMode === "analytics" ? "bg-white/20" : ""
              }`}
              onClick={() => setViewMode("analytics")}
            >
              <BarChart3 className="h-4 w-4" />
              Analytics
            </Button>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" className="gap-2 text-white hover:bg-white/20">
                  <Filter className="h-4 w-4" />
                  Filtro
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 rounded-xl border border-border bg-popover/95 p-4 shadow-lg">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">Filtros rápidos</h3>
                    <p className="text-xs text-muted-foreground">
                      Refine os cards exibidos no quadro atual.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="search" className="text-xs font-medium text-muted-foreground">
                      Busca por título
                    </Label>
                    <Input
                      id="search"
                      placeholder="Digite para filtrar por título..."
                      value={filters.search}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          search: e.target.value,
                        }))
                      }
                      className="h-9 border-input bg-background text-sm"
                    />
                  </div>

                  {board.availableTags.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-muted-foreground">Etiquetas</p>
                      <ScrollArea className="h-20 rounded-md border border-border/60 bg-background/80 px-2 py-1">
                        <div className="space-y-1">
                          {board.availableTags.map((tag) => {
                            const checked = filters.tags.includes(tag.id);
                            return (
                              <label
                                key={tag.id}
                                className="flex cursor-pointer items-center gap-2 rounded px-1 py-1 text-xs hover:bg-muted"
                              >
                                <Checkbox
                                  checked={checked}
                                  onCheckedChange={(value) => {
                                    setFilters((prev) => ({
                                      ...prev,
                                      tags: value
                                        ? [...prev.tags, tag.id]
                                        : prev.tags.filter((id) => id !== tag.id),
                                    }));
                                  }}
                                />
                                <span className="truncate text-foreground">{tag.name}</span>
                              </label>
                            );
                          })}
                        </div>
                      </ScrollArea>
                    </div>
                  )}

                  {board.members.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-muted-foreground">Membros</p>
                      <ScrollArea className="h-20 rounded-md border border-border/60 bg-background/80 px-2 py-1">
                        <div className="space-y-1">
                          {board.members.map((member) => {
                            const checked = filters.members.includes(member.id);
                            return (
                              <label
                                key={member.id}
                                className="flex cursor-pointer items-center gap-2 rounded px-1 py-1 text-xs hover:bg-muted"
                              >
                                <Checkbox
                                  checked={checked}
                                  onCheckedChange={(value) => {
                                    setFilters((prev) => ({
                                      ...prev,
                                      members: value
                                        ? [...prev.members, member.id]
                                        : prev.members.filter((id) => id !== member.id),
                                    }));
                                  }}
                                />
                                <span className="truncate text-foreground">{member.name}</span>
                              </label>
                            );
                          })}
                        </div>
                      </ScrollArea>
                    </div>
                  )}

                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground">Status</p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <Button
                        type="button"
                        variant={filters.status === "all" ? "default" : "outline"}
                        size="sm"
                        className="h-8 justify-center"
                        onClick={() =>
                          setFilters((prev) => ({
                            ...prev,
                            status: "all",
                          }))
                        }
                      >
                        Todos
                      </Button>
                      <Button
                        type="button"
                        variant={filters.status === "completed" ? "default" : "outline"}
                        size="sm"
                        className="h-8 justify-center"
                        onClick={() =>
                          setFilters((prev) => ({
                            ...prev,
                            status: "completed",
                          }))
                        }
                      >
                        Concluídos
                      </Button>
                      <Button
                        type="button"
                        variant={filters.status === "overdue" ? "default" : "outline"}
                        size="sm"
                        className="h-8 justify-center"
                        onClick={() =>
                          setFilters((prev) => ({
                            ...prev,
                            status: "overdue",
                          }))
                        }
                      >
                        Atrasados
                      </Button>
                      <Button
                        type="button"
                        variant={filters.status === "without_due_date" ? "default" : "outline"}
                        size="sm"
                        className="h-8 justify-center text-[11px]"
                        onClick={() =>
                          setFilters((prev) => ({
                            ...prev,
                            status: "without_due_date",
                          }))
                        }
                      >
                        Sem data
                      </Button>
                    </div>
                  </div>

                  <div className="flex justify-between pt-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2 text-xs"
                      onClick={() =>
                        setFilters({
                          search: "",
                          tags: [],
                          members: [],
                          status: "all",
                        })
                      }
                    >
                      Limpar filtros
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Conteúdo principal */}
      <main className="flex-1 overflow-x-auto p-6">
        {viewMode === "board" && (
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
        )}

        {viewMode === "calendar" && (
          (() => {
            const year = currentMonth.getFullYear();
            const month = currentMonth.getMonth();
            const endOfMonth = new Date(year, month + 1, 0);

            const days: Date[] = [];
            for (let day = 1; day <= endOfMonth.getDate(); day++) {
              days.push(new Date(year, month, day));
            }

            const weekDayLabels = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

            const cardsWithList = board.lists.flatMap((list) =>
              list.cards.map((card) => ({
                card,
                listTitle: list.title,
              }))
            );

            const cardsByDate = new Map<string, { card: Card; listTitle: string }[]>();

            for (const item of cardsWithList) {
              if (!item.card.dueDate) continue;
              const dateKey = item.card.dueDate.toISOString().slice(0, 10);
              const existing = cardsByDate.get(dateKey) || [];
              existing.push(item);
              cardsByDate.set(dateKey, existing);
            }

            const handlePrevMonth = () => {
              setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
            };

            const handleNextMonth = () => {
              setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
            };

            return (
              <section className="space-y-4">
                <header className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-white">
                      {currentMonth.toLocaleDateString("pt-BR", {
                        month: "long",
                        year: "numeric",
                      })}
                    </h2>
                    <p className="text-sm text-white/80">
                      Cards posicionados pela data de vencimento
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white hover:bg-white/20"
                      onClick={handlePrevMonth}
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white hover:bg-white/20"
                      onClick={handleNextMonth}
                    >
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </div>
                </header>

                <div className="rounded-xl bg-white/90 p-4 shadow-lg backdrop-blur-sm">
                  <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold text-muted-foreground">
                    {weekDayLabels.map((label) => (
                      <div key={label} className="py-1">
                        {label}
                      </div>
                    ))}
                  </div>

                  <div className="mt-2 grid grid-cols-7 gap-2 text-xs">
                    {days.map((date) => {
                      const dateKey = date.toISOString().slice(0, 10);
                      const itemsForDay = cardsByDate.get(dateKey) || [];

                      return (
                        <div
                          key={dateKey}
                          className="min-h-[90px] rounded-lg border border-border bg-card p-2"
                        >
                          <div className="mb-1 flex items-center justify_between">
                            <span className="text-xs font-semibold">
                              {date.getDate()}
                            </span>
                            <span className="text-[10px] text-muted-foreground">
                              {date.toLocaleDateString("pt-BR", { weekday: "short" })}
                            </span>
                          </div>

                          <div className="space-y-1">
                            {itemsForDay.map(({ card, listTitle }) => (
                              <button
                                key={card.id}
                                onClick={() => handleCardClick(card)}
                                className="w-full rounded-md bg-primary/5 px-1.5 py-1 text-left text-[11px] hover:bg-primary/10"
                              >
                                <div className="truncate font-medium">{card.title}</div>
                                <div className="truncate text-[10px] text-muted-foreground">
                                  {listTitle}
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>
            );
          })()
        )}

        {viewMode === "analytics" && (
          (() => {
            const allCards = board.lists.flatMap((list) => list.cards);
            const today = new Date();

            const cardsPerList = board.lists.map((list) => ({
              name: list.title,
              value: list.cards.length,
            }));

            const completedCards = allCards.filter(
              (card) =>
                card.checklist &&
                card.checklist.length > 0 &&
                card.checklist.every((item) => item.completed)
            ).length;

            const overdueCards = allCards.filter(
              (card) => card.dueDate && card.dueDate < today
            ).length;

            const withoutDueDate = allCards.filter((card) => !card.dueDate).length;

            const statusData = [
              { name: "Concluídos", value: completedCards },
              { name: "Atrasados", value: overdueCards },
              { name: "Sem data", value: withoutDueDate },
            ];

            const pieColors = [
              "hsl(142 71% 45%)",
              "hsl(0 84% 60%)",
              "hsl(215 20% 65%)",
            ];

            return (
              <section className="space-y-8">
                <header className="flex flex-col gap-1 text-white/90">
                  <h2 className="text-xl font-semibold">Visão geral do quadro</h2>
                  <p className="text-sm text-white/80">
                    Acompanhe rapidamente o volume de trabalho, conclusão e risco de atraso.
                  </p>
                </header>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-2xl border border-white/10 bg-white/95/90 p-4 shadow-sm backdrop-blur-sm">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Total de cards
                    </p>
                    <p className="mt-3 text-3xl font-semibold text-foreground">
                      {allCards.length}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-emerald-100/80 bg-emerald-50/80 p-4 shadow-sm backdrop-blur-sm">
                    <p className="text-xs font-medium text-emerald-700 uppercase tracking-wide">
                      Cards concluídos
                    </p>
                    <p className="mt-3 text-3xl font-semibold text-emerald-900">
                      {completedCards}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-4 shadow-sm backdrop-blur-sm">
                    <p className="text-xs font-medium text-destructive uppercase tracking-wide">
                      Cards atrasados
                    </p>
                    <p className="mt-3 text-3xl font-semibold text-destructive">
                      {overdueCards}
                    </p>
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-white/95 p-4 shadow-sm backdrop-blur-sm">
                    <div className="mb-3 flex items-baseline justify-between">
                      <div>
                        <h3 className="text-sm font-semibold text-foreground">Cards por lista</h3>
                        <p className="text-xs text-muted-foreground">
                          Distribuição dos cards em cada coluna do quadro.
                        </p>
                      </div>
                    </div>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <ReBarChart
                          data={cardsPerList}
                          margin={{ top: 10, right: 10, left: 0, bottom: 40 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(215 16% 90%)" />
                          <XAxis
                            dataKey="name"
                            tick={{ fontSize: 10 }}
                            interval={0}
                            angle={-20}
                            textAnchor="end"
                          />
                          <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
                          <RechartsTooltip />
                          <Bar dataKey="value" fill="hsl(221 83% 53%)" radius={[4, 4, 0, 0]} />
                        </ReBarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/95 p-4 shadow-sm backdrop-blur-sm">
                    <div className="mb-3 flex items-baseline justify-between">
                      <div>
                        <h3 className="text-sm font-semibold text-foreground">Status dos cards</h3>
                        <p className="text-xs text-muted-foreground">
                          Progresso geral considerando conclusão e atrasos.
                        </p>
                      </div>
                    </div>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={statusData}
                            dataKey="value"
                            nameKey="name"
                            outerRadius={80}
                            label
                          >
                            {statusData.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={pieColors[index % pieColors.length]}
                              />
                            ))}
                          </Pie>
                          <RechartsTooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </section>
            );
          })()
        )}

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
