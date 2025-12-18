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

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  text: string;
  createdAt: string;
}

export interface Card {
  id: string;
  title: string;
  description?: string;
  listId: string;
  tags: Tag[];
  members: Member[];
  dueDate?: Date;
  coverImage?: string;
  checklist?: ChecklistItem[];
  comments?: Comment[];
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
  availableTags: Tag[];
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
    availableTags: [
      { id: "t1", name: "Research", color: "hsl(172 66% 50%)" },
      { id: "t2", name: "Documentation", color: "hsl(45 93% 58%)" },
      { id: "t3", name: "Design", color: "hsl(258 90% 66%)" },
      { id: "t4", name: "Frontend", color: "hsl(220 90% 56%)" },
      { id: "t5", name: "Backend", color: "hsl(142 71% 45%)" },
      { id: "t6", name: "API", color: "hsl(220 90% 56%)" },
      { id: "t7", name: "Marketing", color: "hsl(328 86% 70%)" },
    ],
    members: [
      { id: "1", name: "João Silva", email: "joao@taskflow.com", avatar: "👨‍💼" },
      { id: "2", name: "Maria Santos", email: "maria@taskflow.com", avatar: "👩‍💼" },
      { id: "3", name: "Pedro Costa", email: "pedro@taskflow.com", avatar: "👨‍🎨" },
      { id: "4", name: "Ana Lima", email: "ana@taskflow.com", avatar: "👩‍💻" },
    ],
    lists: [
      {
        id: "l1",
        title: "Backlog",
        boardId: "1",
        order: 0,
        cards: [
          {
            id: "c1",
            title: "Market Research Analysis",
            description: "Conduct comprehensive market research for the new product line. Analyze competitor strategies and identify key opportunities.",
            listId: "l1",
            tags: [
              { id: "t1", name: "Research", color: "hsl(172 66% 50%)" },
              { id: "t2", name: "Documentation", color: "hsl(45 93% 58%)" },
            ],
            members: [
              { id: "1", name: "João Silva", email: "joao@taskflow.com", avatar: "👨‍💼" },
              { id: "2", name: "Maria Santos", email: "maria@taskflow.com", avatar: "👩‍💼" },
            ],
            dueDate: new Date("2024-12-19"),
            checklist: [
              { id: "ch1", text: "Gather competitor data", completed: true },
              { id: "ch2", text: "Analyze market trends", completed: true },
              { id: "ch3", text: "Create report", completed: false },
            ],
            comments: [
              {
                id: "cm1",
                userId: "1",
                userName: "Ana Silva",
                userAvatar: "👩",
                text: "Started initial research on competitor websites",
                createdAt: "Dec 9 9:00 PM",
              },
            ],
            order: 0,
          },
          {
            id: "c2",
            title: "Define brand guidelines",
            listId: "l1",
            tags: [],
            members: [{ id: "3", name: "Pedro Costa", email: "pedro@taskflow.com", avatar: "👨‍🎨" }],
            order: 1,
          },
        ],
      },
      {
        id: "l2",
        title: "In Progress",
        boardId: "1",
        order: 1,
        cards: [
          {
            id: "c3",
            title: "Landing Page Design",
            coverImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=200&fit=crop",
            description: "Create modern and responsive landing page design for the new product.",
            listId: "l2",
            tags: [
              { id: "t3", name: "Design", color: "hsl(258 90% 66%)" },
              { id: "t4", name: "Frontend", color: "hsl(220 90% 56%)" },
            ],
            members: [
              { id: "1", name: "João Silva", email: "joao@taskflow.com", avatar: "👨‍💼" },
              { id: "2", name: "Maria Santos", email: "maria@taskflow.com", avatar: "👩‍💼" },
              { id: "4", name: "Ana Lima", email: "ana@taskflow.com", avatar: "👩‍💻" },
            ],
            dueDate: new Date("2024-12-17"),
            checklist: [
              { id: "ch4", text: "Wireframes", completed: true },
              { id: "ch5", text: "High-fidelity mockups", completed: false },
              { id: "ch6", text: "Responsive design", completed: false },
              { id: "ch7", text: "Developer handoff", completed: false },
            ],
            order: 0,
          },
          {
            id: "c4",
            title: "API Integration Setup",
            listId: "l2",
            tags: [
              { id: "t5", name: "Backend", color: "hsl(142 71% 45%)" },
              { id: "t6", name: "API", color: "hsl(220 90% 56%)" },
            ],
            members: [{ id: "4", name: "Ana Lima", email: "ana@taskflow.com", avatar: "👩‍💻" }],
            order: 1,
          },
        ],
      },
      {
        id: "l3",
        title: "Review",
        boardId: "1",
        order: 2,
        cards: [
          {
            id: "c5",
            title: "Email Campaign Templates",
            listId: "l3",
            tags: [
              { id: "t7", name: "Marketing", color: "hsl(328 86% 70%)" },
            ],
            members: [{ id: "2", name: "Maria Santos", email: "maria@taskflow.com", avatar: "👩‍💼" }],
            order: 0,
          },
        ],
      },
      {
        id: "l4",
        title: "Done",
        boardId: "1",
        order: 3,
        cards: [
          {
            id: "c6",
            title: "Project Kickoff Meeting",
            listId: "l4",
            tags: [],
            members: [
              { id: "1", name: "João Silva", email: "joao@taskflow.com", avatar: "👨‍💼" },
              { id: "2", name: "Maria Santos", email: "maria@taskflow.com", avatar: "👩‍💼" },
              { id: "3", name: "Pedro Costa", email: "pedro@taskflow.com", avatar: "👨‍🎨" },
              { id: "4", name: "Ana Lima", email: "ana@taskflow.com", avatar: "👩‍💻" },
            ],
            checklist: [
              { id: "ch8", text: "Send meeting notes", completed: true },
              { id: "ch9", text: "Update project roadmap", completed: true },
              { id: "ch10", text: "Assign initial tasks", completed: true },
            ],
            order: 0,
          },
        ],
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
    availableTags: [],
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
    availableTags: [
      { id: "t1", name: "Frontend", color: "hsl(220 90% 56%)" },
      { id: "t2", name: "Priority", color: "hsl(25 95% 55%)" },
      { id: "t3", name: "Feature", color: "hsl(142 71% 45%)" },
      { id: "t4", name: "Analytics", color: "hsl(258 90% 66%)" },
      { id: "t5", name: "Bug", color: "hsl(0 84% 60%)" },
      { id: "t6", name: "Critical", color: "hsl(25 95% 55%)" },
      { id: "t7", name: "Completed", color: "hsl(142 71% 45%)" },
    ],
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
            dueDate: new Date("2024-12-18"),
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
            dueDate: new Date("2024-12-16"),
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
    availableTags: [],
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
        board.updatedAt = "just now";
        this.notify();
        return newCard;
      }
    }
  }

  duplicateCard(cardId: string) {
    for (const board of this.boards) {
      for (const list of board.lists) {
        const cardIndex = list.cards.findIndex((c) => c.id === cardId);
        if (cardIndex !== -1) {
          const originalCard = list.cards[cardIndex];
          const duplicatedCard: Card = {
            ...originalCard,
            id: `c${Date.now()}`,
            title: `${originalCard.title} (cópia)`,
            order: list.cards.length,
          };
          list.cards.push(duplicatedCard);
          board.updatedAt = "just now";
          this.notify();
          return duplicatedCard;
        }
      }
    }
  }

  updateCard(cardId: string, updates: Partial<Card>) {
    for (const board of this.boards) {
      for (const list of board.lists) {
        const cardIndex = list.cards.findIndex((c) => c.id === cardId);
        if (cardIndex !== -1) {
          list.cards[cardIndex] = { ...list.cards[cardIndex], ...updates };
          board.updatedAt = "just now";
          this.notify();
          return;
        }
      }
    }
  }

  archiveCard(cardId: string) {
    // For now, just delete - could implement archive functionality later
    this.deleteCard(cardId);
  }

  moveCard(cardId: string, newListId: string) {
    for (const board of this.boards) {
      // Encontrar o card na lista atual
      let sourceList: List | undefined;
      let cardToMove: Card | undefined;
      let cardIndex = -1;

      for (const list of board.lists) {
        cardIndex = list.cards.findIndex((c) => c.id === cardId);
        if (cardIndex !== -1) {
          sourceList = list;
          cardToMove = list.cards[cardIndex];
          break;
        }
      }

      if (sourceList && cardToMove) {
        // Se a lista de destino for diferente da origem
        if (sourceList.id !== newListId) {
          // Remover da lista original
          sourceList.cards.splice(cardIndex, 1);
          
          // Adicionar na nova lista
          const targetList = board.lists.find((l) => l.id === newListId);
          if (targetList) {
            cardToMove.listId = newListId;
            targetList.cards.push(cardToMove);
            this.notify();
            return;
          }
        }
        return;
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

  // Tag management methods
  addBoardTag(boardId: string, name: string, color: string) {
    const board = this.boards.find((b) => b.id === boardId);
    if (board) {
      const newTag: Tag = {
        id: `t${Date.now()}`,
        name,
        color,
      };
      board.availableTags.push(newTag);
      this.notify();
      return newTag;
    }
  }

  updateBoardTag(boardId: string, tagId: string, updates: Partial<Tag>) {
    const board = this.boards.find((b) => b.id === boardId);
    if (board) {
      const tagIndex = board.availableTags.findIndex((t) => t.id === tagId);
      if (tagIndex !== -1) {
        board.availableTags[tagIndex] = { ...board.availableTags[tagIndex], ...updates };
        
        // Update tag in all cards that use it
        for (const list of board.lists) {
          for (const card of list.cards) {
            const cardTagIndex = card.tags.findIndex((t) => t.id === tagId);
            if (cardTagIndex !== -1) {
              card.tags[cardTagIndex] = { ...card.tags[cardTagIndex], ...updates };
            }
          }
        }
        this.notify();
      }
    }
  }

  deleteBoardTag(boardId: string, tagId: string) {
    const board = this.boards.find((b) => b.id === boardId);
    if (board) {
      board.availableTags = board.availableTags.filter((t) => t.id !== tagId);
      
      // Remove tag from all cards
      for (const list of board.lists) {
        for (const card of list.cards) {
          card.tags = card.tags.filter((t) => t.id !== tagId);
        }
      }
      this.notify();
    }
  }

  addTagToCard(cardId: string, tag: Tag) {
    for (const board of this.boards) {
      for (const list of board.lists) {
        const card = list.cards.find((c) => c.id === cardId);
        if (card) {
          // Check if tag already exists on card
          if (!card.tags.find((t) => t.id === tag.id)) {
            card.tags.push(tag);
            this.notify();
          }
          return;
        }
      }
    }
  }

  removeTagFromCard(cardId: string, tagId: string) {
    for (const board of this.boards) {
      for (const list of board.lists) {
        const card = list.cards.find((c) => c.id === cardId);
        if (card) {
          card.tags = card.tags.filter((t) => t.id !== tagId);
          this.notify();
          return;
        }
      }
    }
  }

  // Member management methods
  addMemberToCard(cardId: string, member: Member) {
    for (const board of this.boards) {
      for (const list of board.lists) {
        const card = list.cards.find((c) => c.id === cardId);
        if (card) {
          // Check if member already exists on card
          if (!card.members.find((m) => m.id === member.id)) {
            card.members.push(member);
            this.notify();
          }
          return;
        }
      }
    }
  }

  removeMemberFromCard(cardId: string, memberId: string) {
    for (const board of this.boards) {
      for (const list of board.lists) {
        const card = list.cards.find((c) => c.id === cardId);
        if (card) {
          card.members = card.members.filter((m) => m.id !== memberId);
          this.notify();
          return;
        }
      }
    }
  }
}

export const store = new Store();
