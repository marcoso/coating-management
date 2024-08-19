import { Roles } from 'src/app/core/enums/roles';
import { RouteInfo } from './sidebar.metadata';

export const ROUTES: RouteInfo[] = [
  {
    path: 'projects/my-projects',
    title: 'MENUITEMS.HOME.TEXT',
    moduleName: 'myprojects',
    icon: 'fas fa-home',
    class: '',
    groupTitle: false,
    submenu: [],
    showRoles: [Roles.Administrator, Roles.ProjectManager, Roles.Inspector]
  },
  {
    path: 'clients',
    title: 'MENUITEMS.CLIENTS.TEXT',
    moduleName: 'clients',
    icon: 'fas fa-user-friends',
    class: '',
    groupTitle: false,
    submenu: [],
    showRoles: [Roles.Administrator, Roles.ProjectManager]
  },
  {
    path: 'projects/all',
    title: 'MENUITEMS.PROJECTS.TEXT',
    moduleName: 'projects',
    icon: 'fas fa-folder-open',
    class: '',
    groupTitle: false,
    submenu: [],
    showRoles: [Roles.Administrator, Roles.ProjectManager, Roles.Inspector]
  },
  {
    path: 'projects/completed-reports',
    title: 'MENUITEMS.REPORTS.TEXT',
    moduleName: 'projects',
    icon: 'fas fa-chart-line',
    class: '',
    groupTitle: false,
    submenu: [],
    showRoles: [Roles.Administrator, Roles.ProjectManager]
  },
  {
    path: 'users',
    title: 'MENUITEMS.USERS.TEXT',
    moduleName: 'users',
    icon: 'fas fa-users',
    class: '',
    groupTitle: false,
    submenu: [],
    showRoles: [Roles.Administrator]
  },
  {
    path: 'configuration',
    title: 'MENUITEMS.CONFIGURATION.TEXT',
    moduleName: 'configuration',
    icon: 'fas fa-cogs',
    class: '',
    groupTitle: false,
    submenu: [],
    showRoles: [Roles.Administrator]
  },  
];
