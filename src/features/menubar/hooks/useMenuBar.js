import { useAppContext } from '../../../contexts/AppContext';
import { useTheme } from '../../../hooks/useTheme';

export const useMenuBar = () => {
  const {
    isSidebarOpen,
    setIsSidebarOpen,
    isMobileSidebarOpen,
    setIsMobileSidebarOpen,
    searchQuery,
    setSearchQuery
  } = useAppContext();
  const { cycleTheme } = useTheme();

  const onSidebarToggle = () => setIsMobileSidebarOpen(!isMobileSidebarOpen);
  const onThemeToggle = cycleTheme;

  return {
    isSidebarOpen,
    setIsSidebarOpen,
    isMobileSidebarOpen,
    setIsMobileSidebarOpen,
    searchQuery,
    setSearchQuery,
    onSidebarToggle,
    onThemeToggle
  };
}; 