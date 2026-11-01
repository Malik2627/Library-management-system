export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const d = new Date(dateString);
    return isNaN(d.getTime()) ? dateString : d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch {
    return dateString;
  }
};

export const getStatusBadgeClass = (status) => {
  switch (status?.toLowerCase()) {
    case 'available':
      return 'badge-success';
    case 'borrowed':
      return 'badge-warning';
    case 'reserved':
      return 'badge-accent';
    case 'maintenance':
      return 'badge-danger';
    default:
      return 'badge-default';
  }
};

