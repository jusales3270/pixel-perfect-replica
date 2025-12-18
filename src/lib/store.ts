export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface Member {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface Card {
  id: string;
  title: string;
  description?: string;
  listId: string;
  tags: Tag[];
  members: Member[];
  dueDate?: string;
  coverImage?: string;
  checklist?: ChecklistItem[];
  order: number;
}

export interface List {
  id: string;
  title: string;
  boardId: string;
  cards: Card[];
  order: number;
}

export interface Board {
  id: string;
  title: string;
  description?: string;
  color: string;
  isFavorite: boolean;
  lists: List[];
  members: Member[];
  updatedAt: string;
}

// Mock data
export const mockBoards: Board[] = [
  {
    id: "1",
    title: "Product Launch 2025",
    description: "Planning and execution of Q1 product launch",
    color: "hsl(25 95% 55%)",
    isFavorite: false,
    updatedAt: "2 days ago",
    members: [
      { id: "1", name: "João Silva", email: "joao@taskflow.com", avatar: "👨‍💼" },
      { id: "2", name: "Maria Santos", email: "maria@taskflow.com", avatar: "👩‍💼" },
      { id: "3", name: "Pedro Costa", email: "pedro@taskflow.com", avatar: "👨‍🎨" },
      { id: "4", name: "Ana Lima", email: "ana@taskflow.com", avatar: "👩‍💻" },
    ],
    lists: [
      {
        id: "l1",
        title: "A Fazer",
        boardId: "1",
        order: 0,
        cards: [],
      },
      {
        id: "l2",
        title: "Em Progresso",
        boardId: "1",
        order: 1,
        cards: [],
      },
      {
        id: "l3",
        title: "Concluído",
        boardId: "1",
        order: 2,
        cards: [],
      },
    ],
  },
  {
    id: "2",
    title: "Mobile App Development",
    description: "iOS and Android app development roadmap",
    color: "hsl(258 90% 66%)",
    isFavorite: false,
    updatedAt: "about 1 year ago",
    members: [
      { id: "1", name: "João Silva", email: "joao@taskflow.com", avatar: "👨‍💼" },
      { id: "2", name: "Maria Santos", email: "maria@taskflow.com", avatar: "👩‍💼" },
      { id: "5", name: "Carlos Souza", email: "carlos@taskflow.com", avatar: "👨‍💻" },
      { id: "6", name: "Julia Oliveira", email: "julia@taskflow.com", avatar: "👩‍🎨" },
    ],
    lists: [
      {
        id: "l4",
        title: "Backlog",
        boardId: "2",
        order: 0,
        cards: [],
      },
      {
        id: "l5",
        title: "Em Desenvolvimento",
        boardId: "2",
        order: 1,
        cards: [],
      },
      {
        id: "l6",
        title: "Testando",
        boardId: "2",
        order: 2,
        cards: [],
      },
    ],
  },
  {
    id: "3",
    title: "Team Sprint Board",
    description: "Current sprint tasks and progress",
    color: "hsl(172 66% 50%)",
    isFavorite: true,
    updatedAt: "2 days ago",
    members: [
      { id: "1", name: "João Silva", email: "joao@taskflow.com", avatar: "👨‍💼" },
      { id: "2", name: "Maria Santos", email: "maria@taskflow.com", avatar: "👩‍💼" },
      { id: "3", name: "Pedro Costa", email: "pedro@taskflow.com", avatar: "👨‍🎨" },
      { id: "4", name: "Ana Lima", email: "ana@taskflow.com", avatar: "👩‍💻" },
      { id: "7", name: "Rafael Mendes", email: "rafael@taskflow.com", avatar: "🧑‍💼" },
    ],
    lists: [
      {
        id: "l7",
        title: "Sprint Backlog",
        boardId: "3",
        order: 0,
        cards: [
          {
            id: "c1",
            title: "Performance Optimization",
            listId: "l7",
            tags: [
              { id: "t1", name: "Frontend", color: "hsl(220 90% 56%)" },
              { id: "t2", name: "Priority", color: "hsl(25 95% 55%)" },
            ],
            members: [{ id: "3", name: "Pedro Costa", email: "pedro@taskflow.com", avatar: "👨‍🎨" }],
            order: 0,
          },
        ],
      },
      {
        id: "l8",
        title: "In Progress",
        boardId: "3",
        order: 1,
        cards: [
          {
            id: "c2",
            title: "Dashboard Analytics Widget",
            coverImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop",
            listId: "l8",
            tags: [
              { id: "t3", name: "Feature", color: "hsl(142 71% 45%)" },
              { id: "t4", name: "Analytics", color: "hsl(258 90% 66%)" },
            ],
            members: [
              { id: "1", name: "João Silva", email: "joao@taskflow.com", avatar: "👨‍💼" },
              { id: "2", name: "Maria Santos", email: "maria@taskflow.com", avatar: "👩‍💼" },
            ],
            dueDate: "Dec 18",
            checklist: [
              { id: "ch1", text: "Design mockup", completed: true },
              { id: "ch2", text: "API integration", completed: false },
              { id: "ch3", text: "Testing", completed: false },
            ],
            order: 0,
          },
          {
            id: "c3",
            title: "Bug: Login timeout issue",
            listId: "l8",
            tags: [
              { id: "t5", name: "Bug", color: "hsl(0 84% 60%)" },
              { id: "t6", name: "Critical", color: "hsl(25 95% 55%)" },
            ],
            members: [{ id: "4", name: "Ana Lima", email: "ana@taskflow.com", avatar: "👩‍💻" }],
            dueDate: "Dec 16",
            order: 1,
          },
        ],
      },
      {
        id: "l9",
        title: "Completed",
        boardId: "3",
        order: 2,
        cards: [
          {
            id: "c4",
            title: "User Profile Page",
            listId: "l9",
            tags: [{ id: "t7", name: "Completed", color: "hsl(142 71% 45%)" }],
            members: [{ id: "5", name: "Carlos Souza", email: "carlos@taskflow.com", avatar: "👨‍💻" }],
            order: 0,
          },
        ],
      },
    ],
  },
  {
    id: "4",
    title: "teste prefs",
    description: "",
    color: "hsl(8 92% 64%)",
    isFavorite: false,
    updatedAt: "2 days ago",
    members: [{ id: "1", name: "Ana Silva", email: "ana@taskflow.com", avatar: "👩" }],
    lists: [],
  },
];

// Store state
class Store {
  private boards: Board[] = mockBoards;
  private listeners: (() => void)[] = [];

  subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach((listener) => listener());
  }

  getBoards(): Board[] {
    return this.boards;
  }

  getBoard(id: string): Board | undefined {
    return this.boards.find((b) => b.id === id);
  }

  getFavoriteBoards(): Board[] {
    return this.boards.filter((b) => b.isFavorite);
  }

  getRecentBoards(): Board[] {
    return this.boards.slice().sort((a, b) => {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
  }

  addBoard(board: Omit<Board, "id" | "updatedAt">) {
    const newBoard: Board = {
      ...board,
      id: Date.now().toString(),
      updatedAt: "just now",
    };
    this.boards.push(newBoard);
    this.notify();
    return newBoard;
  }

  updateBoard(id: string, updates: Partial<Board>) {
    const index = this.boards.findIndex((b) => b.id === id);
    if (index !== -1) {
      this.boards[index] = { ...this.boards[index], ...updates, updatedAt: "just now" };
      this.notify();
    }
  }

  toggleFavorite(id: string) {
    const board = this.boards.find((b) => b.id === id);
    if (board) {
      board.isFavorite = !board.isFavorite;
      this.notify();
    }
  }

  deleteBoard(id: string) {
    this.boards = this.boards.filter((b) => b.id !== id);
    this.notify();
  }

  addList(boardId: string, title: string) {
    const board = this.boards.find((b) => b.id === boardId);
    if (board) {
      const newList: List = {
        id: `l${Date.now()}`,
        title,
        boardId,
        cards: [],
        order: board.lists.length,
      };
      board.lists.push(newList);
      this.notify();
      return newList;
    }
  }

  addCard(listId: string, title: string) {
    for (const board of this.boards) {
      const list = board.lists.find((l) => l.id === listId);
      if (list) {
        const newCard: Card = {
          id: `c${Date.now()}`,
          title,
          listId,
          tags: [],
          members: [],
          order: list.cards.length,
        };
        list.cards.push(newCard);
        this.notify();
        return newCard;
      }
    }
  }

  moveCard(cardId: string, newListId: string) {
    for (const board of this.boards) {
      for (const list of board.lists) {
        const cardIndex = list.cards.findIndex((c) => c.id === cardId);
        if (cardIndex !== -1) {
          const [card] = list.cards.splice(cardIndex, 1);
          const newList = board.lists.find((l) => l.id === newListId);
          if (newList) {
            card.listId = newListId;
            newList.cards.push(card);
            this.notify();
            return;
          }
        }
      }
    }
  }

  deleteCard(cardId: string) {
    for (const board of this.boards) {
      for (const list of board.lists) {
        list.cards = list.cards.filter((c) => c.id !== cardId);
      }
    }
    this.notify();
  }
}

export const store = new Store();
