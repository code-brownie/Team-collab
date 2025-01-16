import { 
    LayoutDashboard, 
    CheckSquare, 
    Bell, 
    FolderInput,
    KanbanSquare,
    MessageSquare
  } from "lucide-react";
  
  export const links = [
    {
      id: 1,
      name: 'Overview',
      path: 'project/:id/overview',
      icon: {
        name: LayoutDashboard,
        size: 20
      }
    },
    {
      id: 2,
      name: 'Tasks',
      path: 'project/:id/task',
      icon: {
        name: CheckSquare,
        size: 20
      }
    },
    {
      id: 3,
      name: 'Notifications',
      path: 'project/:id/notification',
      icon: {
        name: Bell,
        size: 20
      }
    },
    {
      id: 4,
      name: 'File Sharing',
      path: 'project/:id/file-sharing',
      icon: {
        name: FolderInput,
        size: 20
      }
    },
    {
      id: 5,
      name: 'Kanban',
      path: 'project/:id/kanban',
      icon: {
        name: KanbanSquare,
        size: 20
      }
    },
    {
      id: 6,
      name: 'Chat',
      path: 'project/:id/chat',
      icon: {
        name: MessageSquare,
        size: 20
      }
    }
  ];