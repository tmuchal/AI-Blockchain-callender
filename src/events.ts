export interface BlockchainEvent {
  id: string;
  name: string;
  location: string;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  color: string;
  url: string;
  emoji: string;
}

export const EVENTS: BlockchainEvent[] = [
  // March 2026
  {
    id: 'ethdenver-2026',
    name: 'ETHDenver',
    location: 'Denver, USA',
    startDate: '2026-03-04',
    endDate: '2026-03-09',
    color: '#8b5cf6',
    url: 'https://www.ethdenver.com',
    emoji: '🦄',
  },
  {
    id: 'bitcoin-summit-2026',
    name: 'Bitcoin Summit',
    location: 'Miami, USA',
    startDate: '2026-03-18',
    endDate: '2026-03-20',
    color: '#f7931a',
    url: 'https://bitcoinsummit.com',
    emoji: '₿',
  },
  {
    id: 'web3-connect-2026',
    name: 'Web3 Connect',
    location: 'Berlin, Germany',
    startDate: '2026-03-25',
    endDate: '2026-03-26',
    color: '#10b981',
    url: 'https://web3connect.io',
    emoji: '🌐',
  },
  // April 2026
  {
    id: 'nft-nyc-2026',
    name: 'NFT.NYC',
    location: 'New York, USA',
    startDate: '2026-04-06',
    endDate: '2026-04-08',
    color: '#ec4899',
    url: 'https://www.nft.nyc',
    emoji: '🖼️',
  },
  {
    id: 'defi-summit-2026',
    name: 'DeFi Summit',
    location: 'London, UK',
    startDate: '2026-04-14',
    endDate: '2026-04-15',
    color: '#3b82f6',
    url: 'https://defisummit.io',
    emoji: '💰',
  },
  {
    id: 'token2049-dubai-2026',
    name: 'TOKEN2049 Dubai',
    location: 'Dubai, UAE',
    startDate: '2026-04-28',
    endDate: '2026-04-30',
    color: '#f7931a',
    url: 'https://www.token2049.com',
    emoji: '🏙️',
  },
  // May 2026
  {
    id: 'consensus-2026',
    name: 'Consensus by CoinDesk',
    location: 'Austin, USA',
    startDate: '2026-05-11',
    endDate: '2026-05-14',
    color: '#06b6d4',
    url: 'https://consensus.coindesk.com',
    emoji: '🤝',
  },
  {
    id: 'blockchain-expo-europe-2026',
    name: 'Blockchain Expo Europe',
    location: 'Amsterdam, Netherlands',
    startDate: '2026-05-20',
    endDate: '2026-05-21',
    color: '#ef4444',
    url: 'https://blockchain-expo.com/europe',
    emoji: '🇪🇺',
  },
  // June 2026
  {
    id: 'superai-2026',
    name: 'SuperAI',
    location: 'Singapore',
    startDate: '2026-06-10',
    endDate: '2026-06-11',
    color: '#7c3aed',
    url: 'https://superai.com',
    emoji: '🤖',
  },
  {
    id: 'ethcc-2026',
    name: 'EthCC',
    location: 'Paris, France',
    startDate: '2026-06-22',
    endDate: '2026-06-25',
    color: '#4f46e5',
    url: 'https://ethcc.io',
    emoji: '🗼',
  },
  // July 2026
  {
    id: 'bitcoin-conference-2026',
    name: 'Bitcoin Conference',
    location: 'Nashville, USA',
    startDate: '2026-07-20',
    endDate: '2026-07-22',
    color: '#f59e0b',
    url: 'https://b.tc/conference',
    emoji: '🎸',
  },
  // August 2026
  {
    id: 'korea-blockchain-week-2026',
    name: 'Korea Blockchain Week',
    location: 'Seoul, Korea',
    startDate: '2026-08-24',
    endDate: '2026-08-30',
    color: '#dc2626',
    url: 'https://koreablockchainweek.com',
    emoji: '🇰🇷',
  },
  // September 2026
  {
    id: 'token2049-singapore-2026',
    name: 'TOKEN2049 Singapore',
    location: 'Singapore',
    startDate: '2026-09-17',
    endDate: '2026-09-18',
    color: '#f7931a',
    url: 'https://www.token2049.com',
    emoji: '🦁',
  },
  {
    id: 'solana-breakpoint-2026',
    name: 'Solana Breakpoint',
    location: 'Singapore',
    startDate: '2026-09-19',
    endDate: '2026-09-21',
    color: '#9945ff',
    url: 'https://solana.com/breakpoint',
    emoji: '☀️',
  },
  // October 2026
  {
    id: 'devcon-2026',
    name: 'Devcon 8',
    location: 'Bangkok, Thailand',
    startDate: '2026-10-12',
    endDate: '2026-10-15',
    color: '#10b981',
    url: 'https://devcon.org',
    emoji: '🐘',
  },
  {
    id: 'chainlink-smartcon-2026',
    name: 'SmartCon by Chainlink',
    location: 'New York, USA',
    startDate: '2026-10-26',
    endDate: '2026-10-27',
    color: '#375bd2',
    url: 'https://smartcon.chain.link',
    emoji: '🔗',
  },
  // November 2026
  {
    id: 'web3-summit-2026',
    name: 'Web3 Summit',
    location: 'Berlin, Germany',
    startDate: '2026-11-09',
    endDate: '2026-11-11',
    color: '#16a34a',
    url: 'https://web3summit.com',
    emoji: '🕸️',
  },
  {
    id: 'korea-fintech-week-2026',
    name: 'Korea FinTech Week',
    location: 'Seoul, Korea',
    startDate: '2026-11-18',
    endDate: '2026-11-20',
    color: '#0ea5e9',
    url: 'https://fintechweek.or.kr',
    emoji: '🏦',
  },
  // December 2026
  {
    id: 'crypto-year-in-review-2026',
    name: 'Crypto Year in Review',
    location: 'Las Vegas, USA',
    startDate: '2026-12-07',
    endDate: '2026-12-09',
    color: '#d97706',
    url: 'https://coindesk.com',
    emoji: '🎄',
  },
];
