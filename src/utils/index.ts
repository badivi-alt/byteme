export const createPageUrl = (pageName: string): string => {
  // Map page names to their corresponding routes
  const routeMap: Record<string, string> = {
    Home: '/',
    Today: '/today',
    Plan: '/plan',
    Library: '/library',
    Insights: '/insights',
    Profile: '/profile',
    Copilot: '/copilot'
  };

  return routeMap[pageName] || '/';
};
