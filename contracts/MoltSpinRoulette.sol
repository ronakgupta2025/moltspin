// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title MoltSpin - American Roulette on Base
 * @notice Provably fair on-chain American Roulette with USDC bets
 * @dev Uses USDC for bets, events for frontend state management
 */

interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

contract MoltSpinRoulette {
    // ============ STATE VARIABLES ============
    
    IERC20 public immutable USDC;
    address public immutable owner;
    
    uint256 public constant MIN_BET = 1_000_000; // 1 USDC (6 decimals)
    uint256 public constant MAX_BET = 1000_000_000; // 1000 USDC
    uint256 public constant HOUSE_EDGE_BPS = 263; // 2.63% (American Roulette edge ~5.26% / 2)
    
    // Bet tracking
    uint256 public nextBetId;
    
    // Red numbers in American Roulette
    mapping(uint8 => bool) public isRed;
    
    // ============ STRUCTS ============
    
    enum BetType {
        Straight,      // Single number (35:1)
        Red,           // Red color (1:1)
        Black,         // Black color (1:1)
        Odd,           // Odd numbers (1:1)
        Even,          // Even numbers (1:1)
        High,          // 19-36 (1:1)
        Low,           // 1-18 (1:1)
        Dozen1,        // 1-12 (2:1)
        Dozen2,        // 13-24 (2:1)
        Dozen3,        // 25-36 (2:1)
        Column1,       // Column 1 (2:1)
        Column2,       // Column 2 (2:1)
        Column3        // Column 3 (2:1)
    }
    
    struct Bet {
        uint256 id;
        address player;
        BetType betType;
        uint8 number;      // For straight bets (0-37, where 37 = 00)
        uint256 amount;
        uint256 timestamp;
        bool settled;
        uint8 result;      // Winning number
        uint256 payout;
    }
    
    // ============ STORAGE ============
    
    mapping(uint256 => Bet) public bets;
    mapping(address => uint256[]) public playerBets;
    
    // ============ EVENTS ============
    
    event BetPlaced(
        uint256 indexed betId,
        address indexed player,
        BetType betType,
        uint8 number,
        uint256 amount,
        uint256 timestamp
    );
    
    event SpinResult(
        uint256 indexed betId,
        address indexed player,
        uint8 winningNumber,
        bool won,
        uint256 payout,
        uint256 timestamp
    );
    
    event HouseFunded(address indexed funder, uint256 amount);
    event HouseWithdrawal(address indexed owner, uint256 amount);
    
    // ============ ERRORS ============
    
    error BetTooLow();
    error BetTooHigh();
    error InvalidNumber();
    error InsufficientHouseBalance();
    error BetAlreadySettled();
    error Unauthorized();
    error TransferFailed();
    
    // ============ CONSTRUCTOR ============
    
    constructor(address _usdc, address _owner) {
        USDC = IERC20(_usdc);
        owner = _owner;
        
        // Initialize red numbers for American Roulette
        isRed[1] = true;
        isRed[3] = true;
        isRed[5] = true;
        isRed[7] = true;
        isRed[9] = true;
        isRed[12] = true;
        isRed[14] = true;
        isRed[16] = true;
        isRed[18] = true;
        isRed[19] = true;
        isRed[21] = true;
        isRed[23] = true;
        isRed[25] = true;
        isRed[27] = true;
        isRed[30] = true;
        isRed[32] = true;
        isRed[34] = true;
        isRed[36] = true;
    }
    
    // ============ MODIFIERS ============
    
    modifier onlyOwner() {
        if (msg.sender != owner) revert Unauthorized();
        _;
    }
    
    // ============ BETTING FUNCTIONS ============
    
    /**
     * @notice Place a straight bet (single number)
     * @param number Number to bet on (0-37, where 37 = 00)
     * @param amount USDC amount to bet
     */
    function betStraight(uint8 number, uint256 amount) external returns (uint256) {
        if (number > 37) revert InvalidNumber();
        return _placeBet(BetType.Straight, number, amount);
    }
    
    /**
     * @notice Bet on red
     */
    function betRed(uint256 amount) external returns (uint256) {
        return _placeBet(BetType.Red, 0, amount);
    }
    
    /**
     * @notice Bet on black
     */
    function betBlack(uint256 amount) external returns (uint256) {
        return _placeBet(BetType.Black, 0, amount);
    }
    
    /**
     * @notice Bet on odd numbers
     */
    function betOdd(uint256 amount) external returns (uint256) {
        return _placeBet(BetType.Odd, 0, amount);
    }
    
    /**
     * @notice Bet on even numbers
     */
    function betEven(uint256 amount) external returns (uint256) {
        return _placeBet(BetType.Even, 0, amount);
    }
    
    /**
     * @notice Bet on high (19-36)
     */
    function betHigh(uint256 amount) external returns (uint256) {
        return _placeBet(BetType.High, 0, amount);
    }
    
    /**
     * @notice Bet on low (1-18)
     */
    function betLow(uint256 amount) external returns (uint256) {
        return _placeBet(BetType.Low, 0, amount);
    }
    
    /**
     * @notice Bet on first dozen (1-12)
     */
    function betDozen1(uint256 amount) external returns (uint256) {
        return _placeBet(BetType.Dozen1, 0, amount);
    }
    
    /**
     * @notice Bet on second dozen (13-24)
     */
    function betDozen2(uint256 amount) external returns (uint256) {
        return _placeBet(BetType.Dozen2, 0, amount);
    }
    
    /**
     * @notice Bet on third dozen (25-36)
     */
    function betDozen3(uint256 amount) external returns (uint256) {
        return _placeBet(BetType.Dozen3, 0, amount);
    }
    
    /**
     * @notice Bet on first column
     */
    function betColumn1(uint256 amount) external returns (uint256) {
        return _placeBet(BetType.Column1, 0, amount);
    }
    
    /**
     * @notice Bet on second column
     */
    function betColumn2(uint256 amount) external returns (uint256) {
        return _placeBet(BetType.Column2, 0, amount);
    }
    
    /**
     * @notice Bet on third column
     */
    function betColumn3(uint256 amount) external returns (uint256) {
        return _placeBet(BetType.Column3, 0, amount);
    }
    
    // ============ INTERNAL FUNCTIONS ============
    
    function _placeBet(BetType betType, uint8 number, uint256 amount) internal returns (uint256) {
        if (amount < MIN_BET) revert BetTooLow();
        if (amount > MAX_BET) revert BetTooHigh();
        
        // Calculate max payout (worst case: straight bet wins)
        uint256 maxPayout = amount * 35;
        if (USDC.balanceOf(address(this)) < maxPayout) revert InsufficientHouseBalance();
        
        // Transfer USDC from player
        if (!USDC.transferFrom(msg.sender, address(this), amount)) revert TransferFailed();
        
        // Create bet
        uint256 betId = nextBetId++;
        bets[betId] = Bet({
            id: betId,
            player: msg.sender,
            betType: betType,
            number: number,
            amount: amount,
            timestamp: block.timestamp,
            settled: false,
            result: 0,
            payout: 0
        });
        
        playerBets[msg.sender].push(betId);
        
        emit BetPlaced(betId, msg.sender, betType, number, amount, block.timestamp);
        
        // Auto-spin immediately
        _spin(betId);
        
        return betId;
    }
    
    function _spin(uint256 betId) internal {
        Bet storage bet = bets[betId];
        if (bet.settled) revert BetAlreadySettled();
        
        // Generate random number (0-37, where 37 = 00)
        // Using block hash + timestamp + betId for randomness
        // NOTE: This is not perfectly secure against miner manipulation
        // For production, consider using Chainlink VRF
        uint256 randomSeed = uint256(
            keccak256(
                abi.encodePacked(
                    blockhash(block.number - 1),
                    block.timestamp,
                    block.prevrandao,
                    betId,
                    msg.sender
                )
            )
        );
        
        uint8 winningNumber = uint8(randomSeed % 38);
        bet.result = winningNumber;
        
        // Check if bet won and calculate payout
        bool won = _checkWin(bet.betType, bet.number, winningNumber);
        uint256 payout = 0;
        
        if (won) {
            payout = _calculatePayout(bet.betType, bet.amount);
            // Transfer winnings
            if (!USDC.transfer(bet.player, payout)) revert TransferFailed();
        }
        
        bet.payout = payout;
        bet.settled = true;
        
        emit SpinResult(betId, bet.player, winningNumber, won, payout, block.timestamp);
    }
    
    function _checkWin(BetType betType, uint8 betNumber, uint8 result) internal view returns (bool) {
        if (betType == BetType.Straight) {
            return betNumber == result;
        }
        
        // 0 and 00 (37) lose on all outside bets
        if (result == 0 || result == 37) {
            return false;
        }
        
        if (betType == BetType.Red) {
            return isRed[result];
        }
        
        if (betType == BetType.Black) {
            return !isRed[result];
        }
        
        if (betType == BetType.Odd) {
            return result % 2 == 1;
        }
        
        if (betType == BetType.Even) {
            return result % 2 == 0;
        }
        
        if (betType == BetType.High) {
            return result >= 19 && result <= 36;
        }
        
        if (betType == BetType.Low) {
            return result >= 1 && result <= 18;
        }
        
        if (betType == BetType.Dozen1) {
            return result >= 1 && result <= 12;
        }
        
        if (betType == BetType.Dozen2) {
            return result >= 13 && result <= 24;
        }
        
        if (betType == BetType.Dozen3) {
            return result >= 25 && result <= 36;
        }
        
        if (betType == BetType.Column1) {
            return result % 3 == 1;
        }
        
        if (betType == BetType.Column2) {
            return result % 3 == 2;
        }
        
        if (betType == BetType.Column3) {
            return result % 3 == 0;
        }
        
        return false;
    }
    
    function _calculatePayout(BetType betType, uint256 betAmount) internal pure returns (uint256) {
        if (betType == BetType.Straight) {
            return betAmount + (betAmount * 35); // 35:1 + original bet
        }
        
        // 1:1 payouts (even money)
        if (
            betType == BetType.Red ||
            betType == BetType.Black ||
            betType == BetType.Odd ||
            betType == BetType.Even ||
            betType == BetType.High ||
            betType == BetType.Low
        ) {
            return betAmount * 2; // 1:1 + original bet
        }
        
        // 2:1 payouts (dozens and columns)
        if (
            betType == BetType.Dozen1 ||
            betType == BetType.Dozen2 ||
            betType == BetType.Dozen3 ||
            betType == BetType.Column1 ||
            betType == BetType.Column2 ||
            betType == BetType.Column3
        ) {
            return betAmount + (betAmount * 2); // 2:1 + original bet
        }
        
        return 0;
    }
    
    // ============ VIEW FUNCTIONS ============
    
    /**
     * @notice Get bet details
     */
    function getBet(uint256 betId) external view returns (Bet memory) {
        return bets[betId];
    }
    
    /**
     * @notice Get all bets for a player
     */
    function getPlayerBets(address player) external view returns (uint256[] memory) {
        return playerBets[player];
    }
    
    /**
     * @notice Get house balance
     */
    function getHouseBalance() external view returns (uint256) {
        return USDC.balanceOf(address(this));
    }
    
    /**
     * @notice Get min/max bet info
     */
    function getBetLimits() external pure returns (uint256 min, uint256 max) {
        return (MIN_BET, MAX_BET);
    }
    
    /**
     * @notice Check if a number is red
     */
    function isRedNumber(uint8 number) external view returns (bool) {
        return isRed[number];
    }
    
    // ============ OWNER FUNCTIONS ============
    
    /**
     * @notice Fund the house
     */
    function fundHouse(uint256 amount) external {
        if (!USDC.transferFrom(msg.sender, address(this), amount)) revert TransferFailed();
        emit HouseFunded(msg.sender, amount);
    }
    
    /**
     * @notice Withdraw from house (owner only)
     */
    function withdrawHouse(uint256 amount) external onlyOwner {
        if (!USDC.transfer(owner, amount)) revert TransferFailed();
        emit HouseWithdrawal(owner, amount);
    }
    
    /**
     * @notice Emergency withdraw all funds (owner only)
     */
    function emergencyWithdraw() external onlyOwner {
        uint256 balance = USDC.balanceOf(address(this));
        if (!USDC.transfer(owner, balance)) revert TransferFailed();
        emit HouseWithdrawal(owner, balance);
    }
}
