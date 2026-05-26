export const ALL_STATUSES = ['PENDING_ASSIGNMENT', 'SUBMITTED', 'RECEIVED', 'IN_PROGRESS', 'RESPONDED', 'CLOSED'];

export const STATUS_BADGE = {
  PENDING_ASSIGNMENT: 'badge badge-received',
  SUBMITTED:   'badge badge-submitted',
  RECEIVED:    'badge badge-received',
  IN_PROGRESS: 'badge badge-inprogress',
  RESPONDED:   'badge badge-responded',
  CLOSED:      'badge badge-closed',
};

export const STATUS_STYLE = {
  PENDING_ASSIGNMENT: { badge: 'badge badge-received',    dot: 'bg-amber-500'  },
  SUBMITTED:   { badge: 'badge badge-submitted',   dot: 'bg-blue-500'   },
  RECEIVED:    { badge: 'badge badge-received',    dot: 'bg-yellow-500' },
  IN_PROGRESS: { badge: 'badge badge-inprogress',  dot: 'bg-orange-500' },
  RESPONDED:   { badge: 'badge badge-responded',   dot: 'bg-green-600'  },
  CLOSED:      { badge: 'badge badge-closed',      dot: 'bg-slate-400'  },
};

export const STATUS_LABEL_KEY = {
  PENDING_ASSIGNMENT: 'statusPendingAssignment',
  SUBMITTED:   'statusSubmitted',
  RECEIVED:    'statusReceived',
  IN_PROGRESS: 'statusInProgress',
  RESPONDED:   'statusResponded',
  CLOSED:      'statusClosed',
};
