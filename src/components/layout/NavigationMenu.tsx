
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  BarChart3, 
  Users, 
  Briefcase, 
  MessageSquare, 
  Calendar, 
  FileText, 
  Settings,
  KanbanSquare,
  FolderKanban,
  FileSpreadsheet,
  Zap,
  ClipboardList,
  DollarSign,
  Bot,  // Replace Gavel with Bot
  RefreshCw,
  UserCheck
} from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton 
} from "@/components/ui/sidebar";

const NavigationMenu = () => {
  const location = useLocation();
  
  const mainNavItems = [
    { icon: BarChart3, label: "Dashboard", path: "/" },
    { icon: Users, label: "Leads", path: "/leads" },
    { icon: ClipboardList, label: "Sales Form", path: "/sales-form" },
    { icon: DollarSign, label: "Payments", path: "/payments" },
    { icon: Briefcase, label: "Projects", path: "/projects" },
    { icon: KanbanSquare, label: "Tasks", path: "/tasks" },
    { icon: MessageSquare, label: "Messages", path: "/messages" },
    { icon: Zap, label: "Automation", path: "/automation" },
    { icon: Calendar, label: "Calendar", path: "/calendar" },
    { icon: FileText, label: "Documents", path: "/documents" },
    { icon: Bot, label: "Better Ask Saul", path: "/better-ask-saul" },  // Updated icon
  ];
  
  const departmentsNavItems = [
    { icon: FolderKanban, label: "Design", path: "/departments/design" },
    { icon: FolderKanban, label: "Development", path: "/departments/development" },
    { icon: FolderKanban, label: "Marketing", path: "/departments/marketing" },
    { icon: FolderKanban, label: "Content", path: "/departments/content" },
    { icon: FolderKanban, label: "Business Development", path: "/departments/business-development" },
    { icon: FolderKanban, label: "Project Management", path: "/departments/project-management" },
  ];

  const renewalsNavItems = [
    { icon: RefreshCw, label: "Active Renewals", path: "/renewals/active" },
    { icon: RefreshCw, label: "Pending Renewals", path: "/renewals/pending" },
    { icon: RefreshCw, label: "Renewal History", path: "/renewals/history" },
  ];

  const hrNavItems = [
    { icon: UserCheck, label: "Employees", path: "/hr/employees" },
    { icon: UserCheck, label: "Recruitment", path: "/hr/recruitment" },
    { icon: UserCheck, label: "Performance", path: "/hr/performance" },
    { icon: UserCheck, label: "Benefits", path: "/hr/benefits" },
  ];

  return (
    <>
      <SidebarGroup>
        <SidebarGroupLabel>Main</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {mainNavItems.map((item) => (
              <SidebarMenuItem key={item.path}>
                <SidebarMenuButton asChild>
                  <Link 
                    to={item.path} 
                    className={cn(
                      "flex items-center gap-2",
                      location.pathname === item.path && "bg-accent text-accent-foreground"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
      
      <SidebarGroup>
        <SidebarGroupLabel>Departments</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {departmentsNavItems.map((item) => (
              <SidebarMenuItem key={item.path}>
                <SidebarMenuButton asChild>
                  <Link 
                    to={item.path} 
                    className={cn(
                      "flex items-center gap-2",
                      location.pathname === item.path && "bg-accent text-accent-foreground"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <SidebarGroup>
        <SidebarGroupLabel>Renewals</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {renewalsNavItems.map((item) => (
              <SidebarMenuItem key={item.path}>
                <SidebarMenuButton asChild>
                  <Link 
                    to={item.path} 
                    className={cn(
                      "flex items-center gap-2",
                      location.pathname === item.path && "bg-accent text-accent-foreground"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <SidebarGroup>
        <SidebarGroupLabel>HR</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {hrNavItems.map((item) => (
              <SidebarMenuItem key={item.path}>
                <SidebarMenuButton asChild>
                  <Link 
                    to={item.path} 
                    className={cn(
                      "flex items-center gap-2",
                      location.pathname === item.path && "bg-accent text-accent-foreground"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
      
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link 
                  to="/settings" 
                  className={cn(
                    "flex items-center gap-2",
                    location.pathname === "/settings" && "bg-accent text-accent-foreground"
                  )}
                >
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </>
  );
};

export default NavigationMenu;

