import { useState } from "react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Check, Search, X } from "lucide-react";
import { Input } from "./ui/input";
import type { Member } from "@/lib/store";

interface MembersManagerProps {
  availableMembers: Member[];
  selectedMembers: Member[];
  onAddMember: (member: Member) => void;
  onRemoveMember: (memberId: string) => void;
}

export const MembersManager = ({
  availableMembers,
  selectedMembers,
  onAddMember,
  onRemoveMember,
}: MembersManagerProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const isMemberSelected = (memberId: string) =>
    selectedMembers.some((m) => m.id === memberId);

  const filteredMembers = availableMembers.filter(
    (member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-80 space-y-3">
      <h3 className="font-semibold text-sm">Membros</h3>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar membros..."
          className="pl-9"
        />
      </div>

      {/* Card Members */}
      {selectedMembers.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-muted-foreground mb-2">
            Membros do cartão
          </p>
          <div className="space-y-2">
            {selectedMembers.map((member) => (
              <div
                key={member.id}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary group"
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{member.avatar}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{member.name}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {member.email}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveMember(member.id)}
                  className="opacity-0 group-hover:opacity-100 shrink-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Available Members */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground mb-2">
          Membros do quadro
        </p>
        <div className="space-y-1 max-h-64 overflow-y-auto">
          {filteredMembers.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              Nenhum membro encontrado
            </p>
          ) : (
            filteredMembers.map((member) => {
              const isSelected = isMemberSelected(member.id);
              return (
                <button
                  key={member.id}
                  onClick={() =>
                    isSelected ? onRemoveMember(member.id) : onAddMember(member)
                  }
                  className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-secondary transition-colors"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{member.avatar}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-sm font-medium truncate">{member.name}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {member.email}
                    </p>
                  </div>
                  {isSelected && (
                    <Check className="h-4 w-4 text-primary shrink-0" />
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
