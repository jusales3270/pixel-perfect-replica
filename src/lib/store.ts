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

export interface Attachment {
  id: string;
  name: string;
  type: string;
  url: string;
  size: number;
  createdAt: string;
}

export type NotificationType = "mention" | "assignment" | "card_move";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  description?: string;
  createdAt: string;
  read: boolean;
  boardId?: string;
  cardId?: string;
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
  attachments?: Attachment[];
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

// Mock data (start with an empty workspace so tests use only newly created data)
export const mockBoards: Board[] = [];


// Store state
class Store {
  private boards: Board[] = mockBoards;
  private notifications: Notification[] = [];
  private listeners: (() => void)[] = [];

  constructor() {
    if (typeof window !== "undefined") {
      try {
        const storedBoards = window.localStorage.getItem("taskflow-boards");
        if (storedBoards) {
          this.boards = JSON.parse(storedBoards) as Board[];
        }
      } catch (error) {
        console.error("Failed to load boards from localStorage", error);
        this.boards = mockBoards;
      }
    }
  }

  private saveBoards() {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem("taskflow-boards", JSON.stringify(this.boards));
    } catch (error) {
      console.error("Failed to save boards to localStorage", error);
    }
  }

  subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.saveBoards();
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

  getNotifications(): Notification[] {
    return this.notifications.slice().sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  getUnreadNotificationsCount(): number {
    return this.notifications.filter((n) => !n.read).length;
  }

  addNotification(notification: Omit<Notification, "id" | "read" | "createdAt">) {
    const newNotification: Notification = {
      id: `n${Date.now()}${Math.random().toString(16).slice(2)}`,
      createdAt: new Date().toISOString(),
      read: false,
      ...notification,
    };

    this.notifications.unshift(newNotification);

    // Mantém apenas as 50 mais recentes
    if (this.notifications.length > 50) {
      this.notifications = this.notifications.slice(0, 50);
    }

    this.notify();
  }

  markAllNotificationsAsRead() {
    if (!this.notifications.length) return;
    this.notifications = this.notifications.map((n) => ({ ...n, read: true }));
    this.notify();
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

  moveCard(cardId: string, newListId: string, targetBoardId?: string) {
    let cardToMove: Card | undefined;
    let sourceBoardId: string | undefined;
    let sourceListId: string | undefined;

    // Find the card in all boards
    for (const board of this.boards) {
      for (const list of board.lists) {
        const card = list.cards.find((c) => c.id === cardId);
        if (card) {
          cardToMove = card;
          sourceBoardId = board.id;
          sourceListId = list.id;
          break;
        }
      }
      if (cardToMove) break;
    }

    if (!cardToMove || !sourceBoardId || !sourceListId) return;

    // Use source board as target if not specified
    const targetBoard = targetBoardId || sourceBoardId;
    
    // Check if it's the same list
    if (targetBoard === sourceBoardId && newListId === sourceListId) return;

    // Remove from source list
    const sourceBoard = this.boards.find((b) => b.id === sourceBoardId);
    if (sourceBoard) {
      const sourceList = sourceBoard.lists.find((l) => l.id === sourceListId);
      if (sourceList) {
        sourceList.cards = sourceList.cards.filter((c) => c.id !== cardId);
      }
    }

    // Add to target list
    const destBoard = this.boards.find((b) => b.id === targetBoard);
    if (destBoard) {
      const targetList = destBoard.lists.find((l) => l.id === newListId);
      if (targetList) {
        cardToMove.listId = newListId;
        targetList.cards.push(cardToMove);
        destBoard.updatedAt = "just now";
      }
    }

    this.notify();
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
