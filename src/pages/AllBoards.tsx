import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { BoardCard, CreateBoardCard } from "@/components/BoardCard";
import { CreateBoardDialog } from "@/components/CreateBoardDialog";
import { Button } from "@/components/ui/button";
import { LayoutGrid, Plus } from "lucide-react";
import { store } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";

const AllBoards = () => {
  const [boards, setBoards] = useState(store.getBoards());
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setBoards(store.getBoards());
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
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LayoutGrid className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Todos os Quadros</h1>
          </div>
          <Button onClick={() => setIsCreateDialogOpen(true)} size="lg" className="gap-2">
            <Plus className="h-5 w-5" />
            Criar Quadro
          </Button>
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

export default AllBoards;
