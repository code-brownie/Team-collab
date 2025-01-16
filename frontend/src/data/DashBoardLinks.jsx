import { 
  LayoutDashboard, 
  Users, 
  FolderKanban 
} from "lucide-react";

export const links = [
  {
    id: 1,
    name: 'Dashboard',
    path: '/dashboard',
    icon: {
      name: LayoutDashboard,
      size: 20
    }
  },
  {
    id: 2,
    name: 'Teams',
    path: '/teams',
    icon: {
      name: Users,
      size: 20
    }
  },
  {
    id: 3,
    name: 'Projects',
    path: '/project',
    icon: {
      name: FolderKanban,
      size: 20
    }
  }
];