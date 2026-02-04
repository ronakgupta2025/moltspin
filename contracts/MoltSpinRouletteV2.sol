// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@chainlink/contracts/src/v0.8/vrf/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";

/**
 * @title MoltSpin - American Roulette on Base (V2)
 * @notice Provably fair on-chain American Roulette with USDC bets and Chainlink VRF
 * @dev Uses USDC for bets, Chainlink VRF for randomness, supports batch betting
 */

interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
}

contract MoltSpinRouletteV2 is VRFConsumerBaseV2 {
    // ============ CHAINLINK VRF ============
    
    VRFCoordinatorV2Interface public immutable VRF_COORDINATOR;
    uint64 public immutable subscriptionId;
    bytes32 public immutable keyHash;
    uint32 public constant CALLBACK_GAS_LIMIT = 200000;
    uint16 public constant REQUEST_CONFIRMATIONS = 3;
    uint32 public constant NUM_WORDS = 1;
    
    // ============ STATE VARIABLES ============
    
    IERC20 public immutable USDC;
    address public immutable owner;
    
    // Variable min bets per bet type (6 decimals for USDC)
    uint256 public minBetStraight = 1_000_000;      // 1 USDC for straight bets
    uint256 public minBetEvenMoney = 5_000_000;     // 5 USDC for red/black/odd/even/high/low
    uint256 public minBetDozen = 2_000_000;         // 2 USDC for dozens/columns
    uint256 public constant MAX_BET = 1000_000_000; // 1000 USDC
    uint256 public constant MAX_BETS_PER_BATCH = 10; // Max bets in single transaction
    
    // Bet tracking
    uint256 public nextBetId;
    uint256 public nextBatchId;
    
    // Red numbers in American Roulette
    mapping(uint8 => bool) public isRed;
    
    // VRF request tracking
    mapping(uint256 => uint256) public vrfRequestToBatchId;
    
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
        uint256 batchId;
        address player;
        BetType betType;
        uint8 number;      // For straight bets (0-37, where 37 = 00)
        uint256 amount;
        uint256 timestamp;
        bool settled;
        uint8 result;      // Winning number
        uint256 payout;
    }
    
    struct BetBatch {
        uint256 id;
        address player;
        uint256[] betIds;
        uint256 totalAmount;
        uint256 totalPayout;
        uint256 timestamp;
        uint256 vrfRequestId;
        bool settled;
        uint8 result;
    }
    
    // ============ STORAGE ============
    
    mapping(uint256 => Bet) public bets;
    mapping(uint256 => BetBatch) public batches;
    mapping(address => uint256[]) public playerBets;
    mapping(address => uint256[]) public playerBatches;
    
    // Pause mechanism for emergencies
    bool public paused;
    
    // ============ EVENTS ============
    
    event BetPlaced(
        uint256 indexed betId,
        uint256 indexed batchId,
        address indexed player,
        BetType betType,
        uint8 number,
        uint256 amount,
        uint256 timestamp
    );
    
    event BatchCreated(
        uint256 indexed batchId,
        address indexed player,
        uint256 betCount,
        uint256 totalAmount,
        uint256 vrfRequestId,
        uint256 timestamp
    );
    
    event SpinResult(
        uint256 indexed batchId,
        address indexed player,
        uint8 winningNumber,
        uint256 totalPayout,
        uint256 timestamp
    );
    
    event BetSettled(
        uint256 indexed betId,
        uint256 indexed batchId,
        bool won,
        uint256 payout
    );
    
    event HouseFunded(address indexed funder, uint256 amount);
    event HouseWithdrawal(address indexed owner, uint256 amount);
    event MinBetUpdated(BetType indexed betType, uint256 newMinBet);
    event PauseToggled(bool paused);
    event VRFRequested(uint256 indexed batchId, uint256 requestId);
    event VRFFulfilled(uint256 indexed requestId, uint256 randomWord);
    
    // ============ ERRORS ============
    
    error BetTooLow();
    error BetTooHigh();
    error InvalidNumber();
    error InsufficientHouseBalance();
    error BatchAlreadySettled();
    error Unauthorized();
    error TransferFailed();
    error ContractPaused();
    error TooManyBets();
    error EmptyBatch();
    error InvalidBatchId();
    error VRFRequestNotFound();
    error InvalidMinBet();
    
    // ============ CONSTRUCTOR ============
    
    constructor(
        address _usdc,
        address _owner,
        address _vrfCoordinator,
        uint64 _subscriptionId,
        bytes32 _keyHash
    ) VRFConsumerBaseV2(_vrfCoordinator) {
        USDC = IERC20(_usdc);
        owner = _owner;
        VRF_COORDINATOR = VRFCoordinatorV2Interface(_vrfCoordinator);
        subscriptionId = _subscriptionId;
        keyHash = _keyHash;
        
        // Initialize red numbers for American Roulette
        _initializeRedNumbers();
    }
    
    function _initializeRedNumbers() private {
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
    
    modifier whenNotPaused() {
        if (paused) revert ContractPaused();
        _;
    }
    
    // ============ BATCH BETTING FUNCTION ============
    
    struct BetInput {
        BetType betType;
        uint8 number;      // Only used for straight bets
        uint256 amount;
    }
    
    /**
     * @notice Place multiple bets in a single transaction
     * @param betInputs Array of bets to place
     * @return batchId The ID of the created bet batch
     */
    function placeBets(BetInput[] calldata betInputs) external whenNotPaused returns (uint256) {
        uint256 numBets = betInputs.length;
        if (numBets == 0) revert EmptyBatch();
        if (numBets > MAX_BETS_PER_BATCH) revert TooManyBets();
        
        uint256 batchId = nextBatchId++;
        uint256[] memory betIds = new uint256[](numBets);
        uint256 totalAmount = 0;
        uint256 maxPossiblePayout = 0;
        
        // Create all bets
        for (uint256 i = 0; i < numBets; i++) {
            BetInput calldata input = betInputs[i];
            
            // Validate bet
            _validateBet(input.betType, input.number, input.amount);
            
            // Calculate max payout for this bet
            uint256 betMaxPayout = _calculatePayout(input.betType, input.amount);
            maxPossiblePayout += betMaxPayout;
            
            // Create bet
            uint256 betId = nextBetId++;
            bets[betId] = Bet({
                id: betId,
                batchId: batchId,
                player: msg.sender,
                betType: input.betType,
                number: input.number,
                amount: input.amount,
                timestamp: block.timestamp,
                settled: false,
                result: 0,
                payout: 0
            });
            
            betIds[i] = betId;
            playerBets[msg.sender].push(betId);
            totalAmount += input.amount;
            
            emit BetPlaced(betId, batchId, msg.sender, input.betType, input.number, input.amount, block.timestamp);
        }
        
        // Check house can cover max payout
        if (USDC.balanceOf(address(this)) < maxPossiblePayout) revert InsufficientHouseBalance();
        
        // Transfer total USDC from player
        if (!USDC.transferFrom(msg.sender, address(this), totalAmount)) revert TransferFailed();
        
        // Request randomness from Chainlink VRF
        uint256 requestId = VRF_COORDINATOR.requestRandomWords(
            keyHash,
            subscriptionId,
            REQUEST_CONFIRMATIONS,
            CALLBACK_GAS_LIMIT,
            NUM_WORDS
        );
        
        vrfRequestToBatchId[requestId] = batchId;
        
        // Create batch
        batches[batchId] = BetBatch({
            id: batchId,
            player: msg.sender,
            betIds: betIds,
            totalAmount: totalAmount,
            totalPayout: 0,
            timestamp: block.timestamp,
            vrfRequestId: requestId,
            settled: false,
            result: 0
        });
        
        playerBatches[msg.sender].push(batchId);
        
        emit BatchCreated(batchId, msg.sender, numBets, totalAmount, requestId, block.timestamp);
        emit VRFRequested(batchId, requestId);
        
        return batchId;
    }
    
    // ============ SINGLE BET CONVENIENCE FUNCTIONS ============
    
    function betStraight(uint8 number, uint256 amount) external whenNotPaused returns (uint256) {
        BetInput[] memory inputs = new BetInput[](1);
        inputs[0] = BetInput(BetType.Straight, number, amount);
        return placeBets(inputs);
    }
    
    function betRed(uint256 amount) external whenNotPaused returns (uint256) {
        BetInput[] memory inputs = new BetInput[](1);
        inputs[0] = BetInput(BetType.Red, 0, amount);
        return placeBets(inputs);
    }
    
    function betBlack(uint256 amount) external whenNotPaused returns (uint256) {
        BetInput[] memory inputs = new BetInput[](1);
        inputs[0] = BetInput(BetType.Black, 0, amount);
        return placeBets(inputs);
    }
    
    function betOdd(uint256 amount) external whenNotPaused returns (uint256) {
        BetInput[] memory inputs = new BetInput[](1);
        inputs[0] = BetInput(BetType.Odd, 0, amount);
        return placeBets(inputs);
    }
    
    function betEven(uint256 amount) external whenNotPaused returns (uint256) {
        BetInput[] memory inputs = new BetInput[](1);
        inputs[0] = BetInput(BetType.Even, 0, amount);
        return placeBets(inputs);
    }
    
    function betHigh(uint256 amount) external whenNotPaused returns (uint256) {
        BetInput[] memory inputs = new BetInput[](1);
        inputs[0] = BetInput(BetType.High, 0, amount);
        return placeBets(inputs);
    }
    
    function betLow(uint256 amount) external whenNotPaused returns (uint256) {
        BetInput[] memory inputs = new BetInput[](1);
        inputs[0] = BetInput(BetType.Low, 0, amount);
        return placeBets(inputs);
    }
    
    function betDozen1(uint256 amount) external whenNotPaused returns (uint256) {
        BetInput[] memory inputs = new BetInput[](1);
        inputs[0] = BetInput(BetType.Dozen1, 0, amount);
        return placeBets(inputs);
    }
    
    function betDozen2(uint256 amount) external whenNotPaused returns (uint256) {
        BetInput[] memory inputs = new BetInput[](1);
        inputs[0] = BetInput(BetType.Dozen2, 0, amount);
        return placeBets(inputs);
    }
    
    function betDozen3(uint256 amount) external whenNotPaused returns (uint256) {
        BetInput[] memory inputs = new BetInput[](1);
        inputs[0] = BetInput(BetType.Dozen3, 0, amount);
        return placeBets(inputs);
    }
    
    function betColumn1(uint256 amount) external whenNotPaused returns (uint256) {
        BetInput[] memory inputs = new BetInput[](1);
        inputs[0] = BetInput(BetType.Column1, 0, amount);
        return placeBets(inputs);
    }
    
    function betColumn2(uint256 amount) external whenNotPaused returns (uint256) {
        BetInput[] memory inputs = new BetInput[](1);
        inputs[0] = BetInput(BetType.Column2, 0, amount);
        return placeBets(inputs);
    }
    
    function betColumn3(uint256 amount) external whenNotPaused returns (uint256) {
        BetInput[] memory inputs = new BetInput[](1);
        inputs[0] = BetInput(BetType.Column3, 0, amount);
        return placeBets(inputs);
    }
    
    // ============ VRF CALLBACK ============
    
    /**
     * @notice Chainlink VRF callback - automatically called when randomness is ready
     * @param requestId The VRF request ID
     * @param randomWords Array of random numbers (we use first one)
     */
    function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords) internal override {
        uint256 batchId = vrfRequestToBatchId[requestId];
        if (batchId == 0) revert VRFRequestNotFound();
        
        BetBatch storage batch = batches[batchId];
        if (batch.settled) revert BatchAlreadySettled();
        
        // Get winning number from random word (0-37)
        uint8 winningNumber = uint8(randomWords[0] % 38);
        batch.result = winningNumber;
        
        emit VRFFulfilled(requestId, randomWords[0]);
        
        // Settle all bets in batch
        uint256 totalPayout = 0;
        for (uint256 i = 0; i < batch.betIds.length; i++) {
            uint256 betId = batch.betIds[i];
            Bet storage bet = bets[betId];
            
            bet.result = winningNumber;
            bool won = _checkWin(bet.betType, bet.number, winningNumber);
            uint256 payout = 0;
            
            if (won) {
                payout = _calculatePayout(bet.betType, bet.amount);
                totalPayout += payout;
            }
            
            bet.payout = payout;
            bet.settled = true;
            
            emit BetSettled(betId, batchId, won, payout);
        }
        
        batch.totalPayout = totalPayout;
        batch.settled = true;
        
        // Transfer total payout to player
        if (totalPayout > 0) {
            if (!USDC.transfer(batch.player, totalPayout)) revert TransferFailed();
        }
        
        emit SpinResult(batchId, batch.player, winningNumber, totalPayout, block.timestamp);
    }
    
    // ============ INTERNAL VALIDATION ============
    
    function _validateBet(BetType betType, uint8 number, uint256 amount) internal view {
        // Check number validity for straight bets
        if (betType == BetType.Straight && number > 37) revert InvalidNumber();
        
        // Check amount against type-specific min bet
        uint256 minBet = _getMinBetForType(betType);
        if (amount < minBet) revert BetTooLow();
        if (amount > MAX_BET) revert BetTooHigh();
    }
    
    function _getMinBetForType(BetType betType) internal view returns (uint256) {
        if (betType == BetType.Straight) {
            return minBetStraight;
        } else if (
            betType == BetType.Red ||
            betType == BetType.Black ||
            betType == BetType.Odd ||
            betType == BetType.Even ||
            betType == BetType.High ||
            betType == BetType.Low
        ) {
            return minBetEvenMoney;
        } else {
            // Dozens and columns
            return minBetDozen;
        }
    }
    
    function _checkWin(BetType betType, uint8 betNumber, uint8 result) internal view returns (bool) {
        if (betType == BetType.Straight) {
            return betNumber == result;
        }
        
        // 0 and 00 (37) lose on all outside bets
        if (result == 0 || result == 37) {
            return false;
        }
        
        if (betType == BetType.Red) return isRed[result];
        if (betType == BetType.Black) return !isRed[result];
        if (betType == BetType.Odd) return result % 2 == 1;
        if (betType == BetType.Even) return result % 2 == 0;
        if (betType == BetType.High) return result >= 19 && result <= 36;
        if (betType == BetType.Low) return result >= 1 && result <= 18;
        if (betType == BetType.Dozen1) return result >= 1 && result <= 12;
        if (betType == BetType.Dozen2) return result >= 13 && result <= 24;
        if (betType == BetType.Dozen3) return result >= 25 && result <= 36;
        if (betType == BetType.Column1) return result % 3 == 1;
        if (betType == BetType.Column2) return result % 3 == 2;
        if (betType == BetType.Column3) return result % 3 == 0;
        
        return false;
    }
    
    function _calculatePayout(BetType betType, uint256 betAmount) internal pure returns (uint256) {
        if (betType == BetType.Straight) {
            return betAmount + (betAmount * 35); // 35:1 + original
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
            return betAmount * 2; // 1:1 + original
        }
        
        // 2:1 payouts (dozens and columns)
        return betAmount + (betAmount * 2); // 2:1 + original
    }
    
    // ============ VIEW FUNCTIONS ============
    
    function getBet(uint256 betId) external view returns (Bet memory) {
        return bets[betId];
    }
    
    function getBatch(uint256 batchId) external view returns (BetBatch memory) {
        return batches[batchId];
    }
    
    function getPlayerBets(address player) external view returns (uint256[] memory) {
        return playerBets[player];
    }
    
    function getPlayerBatches(address player) external view returns (uint256[] memory) {
        return playerBatches[player];
    }
    
    function getHouseBalance() external view returns (uint256) {
        return USDC.balanceOf(address(this));
    }
    
    function getMinBets() external view returns (uint256 straight, uint256 evenMoney, uint256 dozen) {
        return (minBetStraight, minBetEvenMoney, minBetDozen);
    }
    
    function isRedNumber(uint8 number) external view returns (bool) {
        return isRed[number];
    }
    
    // ============ OWNER FUNCTIONS ============
    
    function fundHouse(uint256 amount) external {
        if (!USDC.transferFrom(msg.sender, address(this), amount)) revert TransferFailed();
        emit HouseFunded(msg.sender, amount);
    }
    
    function withdrawHouse(uint256 amount) external onlyOwner {
        if (!USDC.transfer(owner, amount)) revert TransferFailed();
        emit HouseWithdrawal(owner, amount);
    }
    
    function emergencyWithdraw() external onlyOwner {
        uint256 balance = USDC.balanceOf(address(this));
        if (!USDC.transfer(owner, balance)) revert TransferFailed();
        emit HouseWithdrawal(owner, balance);
    }
    
    function setMinBetStraight(uint256 newMinBet) external onlyOwner {
        if (newMinBet == 0 || newMinBet > MAX_BET) revert InvalidMinBet();
        minBetStraight = newMinBet;
        emit MinBetUpdated(BetType.Straight, newMinBet);
    }
    
    function setMinBetEvenMoney(uint256 newMinBet) external onlyOwner {
        if (newMinBet == 0 || newMinBet > MAX_BET) revert InvalidMinBet();
        minBetEvenMoney = newMinBet;
        emit MinBetUpdated(BetType.Red, newMinBet);
    }
    
    function setMinBetDozen(uint256 newMinBet) external onlyOwner {
        if (newMinBet == 0 || newMinBet > MAX_BET) revert InvalidMinBet();
        minBetDozen = newMinBet;
        emit MinBetUpdated(BetType.Dozen1, newMinBet);
    }
    
    function togglePause() external onlyOwner {
        paused = !paused;
        emit PauseToggled(paused);
    }
}
