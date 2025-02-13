export const formatTimestamp = (timestamp: number | string | undefined): string => {
    if (!timestamp) return 'Not available';
    
    const date = new Date(Number(timestamp));
    
    // Format: "Feb 14, 2024, 10:30 AM (GMT+7)"
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZoneName: 'shortOffset'
    }).format(date);
  };
  