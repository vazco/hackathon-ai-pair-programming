import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { useTranslation } from 'react-i18next';
import { ThemeProvider, useTheme } from '@/hooks/useTheme';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';

function ThemeToggle() {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      onClick={toggleTheme}
      className="fixed top-4 right-4 p-2"
      aria-label={t('toggleTheme')}
      size={'icon'}
    >
      {theme === 'dark' ? <Sun /> : <Moon />}
    </Button>
  );
}

function RootComponent() {
  return (
    <div className="min-h-screen flex flex-col">
      <ThemeToggle />
      <main className="w-full md:w-2/3 mx-auto flex flex-col flex-1 p-10">
        <Outlet />
      </main>
      <TanStackRouterDevtools />
    </div>
  );
}

export const Route = createRootRoute({
  component: () => (
    <ThemeProvider>
      <RootComponent />
    </ThemeProvider>
  ),
});
