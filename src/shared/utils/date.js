export const formatDate = (dateString) => {
  if (!dateString) return '';
  const d = new Date(dateString);
  return d.toLocaleDateString(undefined, { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  }) + ' ' + d.toLocaleTimeString(undefined, { 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit' 
  });
};

export const formatDateShort = (dateString) => {
  if (!dateString) return '';
  const d = new Date(dateString);
  return d.toLocaleDateString(undefined, { 
    month: 'short', 
    day: 'numeric' 
  });
}; 