import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { BoardCard, CreateBoardCard } from "@/components/BoardCard";
import { CreateBoardDialog } from "@/components/CreateBoardDialog";
import { Star } from "lucide-react";
import { store } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";

const Favorites = () => {
  const [boards, setBoards] = useState(store.getFavoriteBoards());
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setBoards(store.getFavoriteBoards());
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
          <Star className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Favorite Boards</h1>
        </div>

        {/* Boards Grid */}
        {boards.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Star className="mb-4 h-16 w-16 text-muted-foreground" />
            <h2 className="mb-2 text-xl font-semibold">Nenhum favorito ainda</h2>
            <p className="mb-6 text-muted-foreground">
              Marque seus quadros favoritos para acesso rápido
            </p>
          </div>
        ) : (
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
        )}

        <CreateBoardDialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          onCreateBoard={handleCreateBoard}
        />
      </div>
    </Layout>
  );
};

export default Favorites;
