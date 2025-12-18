import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { BoardCard, CreateBoardCard } from "@/components/BoardCard";
import { CreateBoardDialog } from "@/components/CreateBoardDialog";
import { Clock } from "lucide-react";
import { store } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";

const Recent = () => {
  const [boards, setBoards] = useState(store.getRecentBoards());
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setBoards(store.getRecentBoards());
    });
    return unsubscribe;
  }, []);

  const handleCreateBoard = (title: string, color: string) => {
    store.addBoard({
      title,
      color,
      isFavorite: false,
      lists: [],
      members: [],
    });
    toast({
      title: "Quadro criado!",
      description: `O quadro "${title}" foi criado com sucesso.`,
    });
  };

  const handleToggleFavorite = (id: string) => {
    store.toggleFavorite(id);
  };

  const handleDeleteBoard = (id: string) => {
    store.deleteBoard(id);
    toast({
      title: "Quadro excluído",
      description: "O quadro foi removido com sucesso.",
    });
  };

  return (
    <Layout>
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex items-center gap-3">
          <Clock className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Recentes</h1>
        </div>

        {/* Boards Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {boards.map((board) => (
            <BoardCard
              key={board.id}
              board={board}
              onToggleFavorite={handleToggleFavorite}
              onDelete={handleDeleteBoard}
            />
          ))}
          <CreateBoardCard onClick={() => setIsCreateDialogOpen(true)} />
        </div>

        <CreateBoardDialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          onCreateBoard={handleCreateBoard}
        />
      </div>
    </Layout>
  );
};

export default Recent;
