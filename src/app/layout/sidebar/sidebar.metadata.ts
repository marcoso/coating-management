import { Roles } from "src/app/core/enums/roles";

// Sidebar route metadata
export interface RouteInfo {
  path: string;
  title: string;
  moduleName: string;
  icon: string;
  class: string;
  groupTitle: boolean;
  submenu: RouteInfo[];
  showRoles: Roles[];
}
