import { Address } from 'viem';

// Contract addresses
export const MOLTSPIN_ADDRESS = '0x1C43e4D9734AaB5873ee6BC36646c075eb93040B' as Address;
export const USDC_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' as Address;
export const SPIN_ADDRESS = '0x0e77F5Fd459d080EEc6C6A5cB903F66D2af1Cb07' as Address;

// Token decimals
export const USDC_DECIMALS = 6;
export const SPIN_DECIMALS = 18;

// Bet types mapping (matches contract enum)
export const BET_TYPES = {
  straight: 0,   // 35:1
  red: 1,        // 1:1
  black: 2,      // 1:1
  odd: 3,        // 1:1
  even: 4,       // 1:1
  high: 5,       // 1:1
  low: 6,        // 1:1
  dozen1: 7,     // 2:1
  dozen2: 8,     // 2:1
  dozen3: 9,     // 2:1
  column1: 10,   // 2:1
  column2: 11,   // 2:1
  column3: 12,   // 2:1
} as const;

// MoltSpin Roulette ABI (only the functions we need)
export const MOLTSPIN_ABI = [
  // Read functions
  {
    inputs: [{ name: 'id', type: 'uint256' }],
    name: 'getBet',
    outputs: [
      {
        components: [
          { name: 'player', type: 'address' },
          { name: 'token', type: 'uint8' },
          { name: 'betType', type: 'uint8' },
          { name: 'number', type: 'uint8' },
          { name: 'result', type: 'uint8' },
          { name: 'settled', type: 'bool' },
          { name: 'amount', type: 'uint256' },
          { name: 'payout', type: 'uint256' },
        ],
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'id', type: 'uint256' }],
    name: 'getBatch',
    outputs: [
      {
        components: [
          { name: 'player', type: 'address' },
          { name: 'token', type: 'uint8' },
          { name: 'result', type: 'uint8' },
          { name: 'settled', type: 'bool' },
          { name: 'refunded', type: 'bool' },
          { name: 'totalAmount', type: 'uint256' },
          { name: 'totalPayout', type: 'uint256' },
          { name: 'timestamp', type: 'uint256' },
          { name: 'betIds', type: 'uint256[]' },
        ],
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'p', type: 'address' }],
    name: 'getPlayerBatches',
    outputs: [{ type: 'uint256[]' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'houseBalanceUSDC',
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'houseBalanceSPIN',
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'minBetStraightUSDC',
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'minBetEvenMoneyUSDC',
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'minBetStraightSPIN',
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'minBetEvenMoneySPIN',
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'paused',
    outputs: [{ type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'nextBatchId',
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  // Write functions
  {
    inputs: [
      {
        components: [
          { name: 'betType', type: 'uint8' },
          { name: 'number', type: 'uint8' },
          { name: 'amount', type: 'uint256' },
        ],
        name: 'inputs',
        type: 'tuple[]',
      },
    ],
    name: 'placeBetsUSDC',
    outputs: [{ type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          { name: 'betType', type: 'uint8' },
          { name: 'number', type: 'uint8' },
          { name: 'amount', type: 'uint256' },
        ],
        name: 'inputs',
        type: 'tuple[]',
      },
    ],
    name: 'placeBetsSPIN',
    outputs: [{ type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: 'batchId', type: 'uint256' }],
    name: 'refundStuckBatch',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  // Events
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'betId', type: 'uint256' },
      { indexed: true, name: 'batchId', type: 'uint256' },
      { indexed: true, name: 'player', type: 'address' },
      { indexed: false, name: 'token', type: 'uint8' },
      { indexed: false, name: 'betType', type: 'uint8' },
      { indexed: false, name: 'amount', type: 'uint256' },
    ],
    name: 'BetPlaced',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'batchId', type: 'uint256' },
      { indexed: true, name: 'player', type: 'address' },
      { indexed: false, name: 'token', type: 'uint8' },
      { indexed: false, name: 'totalAmount', type: 'uint256' },
      { indexed: false, name: 'vrfRequestId', type: 'uint256' },
    ],
    name: 'BatchCreated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'batchId', type: 'uint256' },
      { indexed: true, name: 'player', type: 'address' },
      { indexed: false, name: 'winningNumber', type: 'uint8' },
      { indexed: false, name: 'totalPayout', type: 'uint256' },
    ],
    name: 'SpinResult',
    type: 'event',
  },
] as const;

// ERC20 ABI (approve + balanceOf + allowance)
export const ERC20_ABI = [
  {
    inputs: [{ name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'decimals',
    outputs: [{ type: 'uint8' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'symbol',
    outputs: [{ type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;
