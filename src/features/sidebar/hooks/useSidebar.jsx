import { useAppContext } from '../../../contexts/AppContext';
import { useNotes } from '../../../contexts/NotesContext';

export const useSidebar = () => {
  const { 
    selectedNoteId, 
    setSelectedNoteId, 
    isMobileSidebarOpen, 
    setIsMobileSidebarOpen,
    searchQuery 
  } = useAppContext();
  
  const { notes, addNote } = useNotes();

  const handleSelect = (id) => {
    setSelectedNoteId(id);
    if (isMobileSidebarOpen) {
      setIsMobileSidebarOpen(false);
    }
  };

  const handleAdd = () => {
    const newNoteId = addNote();
    setSelectedNoteId(newNoteId);
    if (isMobileSidebarOpen) {
      setIsMobileSidebarOpen(false);
    }
  };

  return {
    notes,
    selectedId: selectedNoteId,
    onSelect: handleSelect,
    onAdd: handleAdd,
    isMobileOpen: isMobileSidebarOpen,
    onMobileClose: () => setIsMobileSidebarOpen(false),
    searchQuery
  };
}; 
