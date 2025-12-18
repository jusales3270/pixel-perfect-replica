import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutGrid, Star, Clock, Moon, Sun, Settings, LogOut, Bell } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useTheme } from "next-themes";
import { store, type Notification } from "@/lib/store";

interface LayoutProps {
  children: React.ReactNode;
  searchPlaceholder?: string;
}

export const Layout = ({ children, searchPlaceholder = "Buscar quadros, cartões..." }: LayoutProps) => {
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState<Notification[]>(store.getNotifications());
  const [unreadCount, setUnreadCount] = useState<number>(
    store.getUnreadNotificationsCount()
  );
  const favoriteBoards = store.getFavoriteBoards();
  const recentBoards = store.getRecentBoards();

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setNotifications(store.getNotifications());
      setUnreadCount(store.getUnreadNotificationsCount());
    });

    return unsubscribe;
  }, []);

  const handleMarkAllAsRead = () => {
    store.markAllNotificationsAsRead();
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-sidebar p-4">
        {/* Logo */}
        <Link to="/" className="mb-8 flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <LayoutGrid className="h-6 w-6" />
          </div>
          <span className="text-xl font-bold">TaskFlow</span>
        </Link>

        {/* Navigation */}
        <nav className="space-y-1">
          <Link
            to="/"
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              isActive("/")
                ? "bg-primary text-primary-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-accent"
            }`}
          >
            <LayoutGrid className="h-5 w-5" />
            Todos os Quadros
          </Link>
          <Link
            to="/favorites"
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              isActive("/favorites")
                ? "bg-primary text-primary-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-accent"
            }`}
          >
            <Star className="h-5 w-5" />
            Favoritos
          </Link>
          <Link
            to="/recent"
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              isActive("/recent")
                ? "bg-primary text-primary-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-accent"
            }`}
          >
            <Clock className="h-5 w-5" />
            Recentes
          </Link>
        </nav>

        {/* Favorites Section */}
        {favoriteBoards.length > 0 && (
          <div className="mt-6">
            <div className="mb-2 flex items-center gap-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <Star className="h-4 w-4" />
              FAVORITOS
            </div>
            <div className="space-y-1">
              {favoriteBoards.map((board) => (
                <Link
                  key={board.id}
                  to={`/board/${board.id}`}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-sidebar-accent"
                >
                  <div
                    className="h-4 w-4 rounded"
                    style={{ backgroundColor: board.color }}
                  />
                  <span className="truncate">{board.title}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Recent Section */}
        {recentBoards.length > 0 && (
          <div className="mt-6">
            <div className="mb-2 flex items-center gap-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <Clock className="h-4 w-4" />
              RECENTES
            </div>
            <div className="space-y-1">
              {recentBoards.slice(0, 4).map((board) => (
                <Link
                  key={board.id}
                  to={`/board/${board.id}`}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-sidebar-accent"
                >
                  <div
                    className="h-4 w-4 rounded"
                    style={{ backgroundColor: board.color }}
                  />
                  <span className="truncate">{board.title}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-border bg-background px-6 py-4">
          <div className="relative w-96">
            <Input
              type="search"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            <svg
              className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute right-1 top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <div className="flex items-center justify-between px-2 py-1.5">
                  <p className="text-xs font-semibold text-muted-foreground">
                    Notificações
                  </p>
                  {notifications.length > 0 && (
                    <button
                      className="text-xs font-medium text-primary hover:underline"
                      onClick={handleMarkAllAsRead}
                    >
                      Marcar todas como lidas
                    </button>
                  )}
                </div>
                <DropdownMenuSeparator />
                <div className="max-h-80 overflow-y-auto py-1">
                  {notifications.length === 0 ? (
                    <p className="px-3 py-6 text-center text-xs text-muted-foreground">
                      Nenhuma notificação recente
                    </p>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`px-3 py-2 text-xs ${
                          notification.read ? "bg-background" : "bg-accent/40"
                        }`}
                      >
                        <p className="font-medium">{notification.title}</p>
                        {notification.description && (
                          <p className="mt-0.5 text-muted-foreground">
                            {notification.description}
                          </p>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      AS
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center gap-2 p-2">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      AS
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">Ana Silva</p>
                    <p className="text-xs text-muted-foreground">ana@taskflow.com</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Configurações
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                  {theme === "dark" ? (
                    <Sun className="mr-2 h-4 w-4" />
                  ) : (
                    <Moon className="mr-2 h-4 w-4" />
                  )}
                  Modo Escuro
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
};
