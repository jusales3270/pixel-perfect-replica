import { useState } from "react";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { Member } from "@/lib/store";

interface AddMemberDialogProps {
  availableMembers: Member[];
  selectedMembers: Member[];
  onAddMember: (member: Member) => void;
}

export const AddMemberDialog = ({
  availableMembers,
  selectedMembers,
  onAddMember,
}: AddMemberDialogProps) => {
  const [open, setOpen] = useState(false);

  const unselectedMembers = availableMembers.filter(
    (member) => !selectedMembers.some((m) => m.id === member.id)
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="w-full justify-start gap-2" size="sm">
          <Avatar className="h-4 w-4">
            <AvatarFallback className="text-[10px]">M</AvatarFallback>
          </Avatar>
          Members
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Members</DialogTitle>
        </DialogHeader>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {unselectedMembers.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              All board members are already added to this card
            </p>
          ) : (
            unselectedMembers.map((member) => (
              <button
                key={member.id}
                onClick={() => {
                  onAddMember(member);
                  setOpen(false);
                }}
                className="flex w-full items-center gap-3 rounded-lg p-3 hover:bg-muted transition-colors"
              >
                <Avatar className="h-10 w-10">
                  <AvatarFallback>{member.avatar}</AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left">
                  <p className="font-medium text-sm">{member.name}</p>
                  <p className="text-xs text-muted-foreground">{member.email}</p>
                </div>
              </button>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
