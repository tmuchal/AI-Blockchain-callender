export interface BlockchainEvent {
  id: string;
  name: string;
  location: string;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  color: string;
  url: string;
}

export const EVENTS: BlockchainEvent[] = [
  {
    id: 'token2049-dubai-2026',
    name: 'TOKEN2049 Dubai',
    location: 'Dubai, UAE',
    startDate: '2026-04-28',
    endDate: '2026-04-30',
    color: '#f7931a',
    url: 'https://www.token2049.com',
  },
  {
    id: 'superai-2026',
    name: 'SuperAI',
    location: 'Singapore',
    startDate: '2026-06-10',
    endDate: '2026-06-11',
    color: '#7c3aed',
    url: 'https://superai.com',
  },
  {
    id: 'token2049-singapore-2026',
    name: 'TOKEN2049 Singapore',
    location: 'Singapore',
    startDate: '2026-09-17',
    endDate: '2026-09-18',
    color: '#f7931a',
    url: 'https://www.token2049.com',
  },
];
