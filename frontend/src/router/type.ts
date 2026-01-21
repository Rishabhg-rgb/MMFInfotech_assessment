export interface RouteItem {
  path: string;
  element: React.ComponentType;
  isProtected?: boolean;
  roles?: string[];
}