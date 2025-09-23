import { Auxiliary } from "@/types/events";

export const getAuxiliaryBadgeVariant = (auxiliary: Auxiliary) => {
  switch (auxiliary) {
    case 'Atfal':
      return 'atfal' as const;
    case 'Khuddam':
      return 'khuddam' as const;
    case 'Lajna':
      return 'lajna' as const;
    case 'Ansar':
      return 'ansar' as const;
    default:
      return 'auxiliary' as const;
  }
};

export const getAuxiliaryFilterColor = (auxiliary: Auxiliary, isActive: boolean) => {
  if (!isActive) return 'bg-filter-inactive text-foreground border-divider hover:bg-muted';
  
  switch (auxiliary) {
    case 'Atfal':
      return 'bg-auxiliary-atfal text-primary-foreground border-auxiliary-atfal';
    case 'Khuddam':
      return 'bg-auxiliary-khuddam text-primary-foreground border-auxiliary-khuddam';
    case 'Lajna':
      return 'bg-auxiliary-lajna text-primary-foreground border-auxiliary-lajna';
    case 'Ansar':
      return 'bg-auxiliary-ansar text-primary-foreground border-auxiliary-ansar';
    default:
      return 'bg-filter-active text-primary-foreground border-filter-active';
  }
};