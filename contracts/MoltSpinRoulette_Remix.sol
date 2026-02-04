// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * ============================================================================
 * MOLTSPIN ROULETTE - FLATTENED FOR REMIX DEPLOYMENT
 * ============================================================================
 * 
 * Deploy on Base Mainnet via Remix IDE
 * 
 * Constructor Parameters:
 * - _usdc:           0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913
 * - _spin:           0x0e77F5Fd459d080EEc6C6A5cB903F66D2af1Cb07
 * - _owner:          YOUR_WALLET_ADDRESS
 * - _vrfCoordinator: 0xd5D517aBE5cF79B7e95eC98dB0f0277788aFF634
 * - _subscriptionId: YOUR_VRF_SUBSCRIPTION_ID
 * - _keyHash:        0x354d2f95da55398f44b7cff77da56283d9c6c829a4bdf1bbcaf2ad6a4d081f61
 * 
 * ============================================================================
 */

// ============ OpenZeppelin ReentrancyGuard ============

abstract contract ReentrancyGuard {
    uint256 private constant _NOT_ENTERED = 1;
    uint256 private constant _ENTERED = 2;
    uint256 private _status;

    constructor() {
        _status = _NOT_ENTERED;
    }

    modifier nonReentrant() {
        require(_status != _ENTERED, "ReentrancyGuard: reentrant call");
        _status = _ENTERED;
        _;
        _status = _NOT_ENTERED;
    }
}

// ============ Chainlink VRF Interfaces ============

interface VRFCoordinatorV2Interface {
    function requestRandomWords(
        bytes32 keyHash,
        uint64 subId,
        uint16 minimumRequestConfirmations,
        uint32 callbackGasLimit,
        uint32 numWords
    ) external returns (uint256 requestId);
}

abstract contract VRFConsumerBaseV2 {
    error OnlyCoordinatorCanFulfill(address have, address want);
    address private immutable vrfCoordinator;

    constructor(address _vrfCoordinator) {
        vrfCoordinator = _vrfCoordinator;
    }

    function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords) internal virtual;

    function rawFulfillRandomWords(uint256 requestId, uint256[] memory randomWords) external {
        if (msg.sender != vrfCoordinator) {
            revert OnlyCoordinatorCanFulfill(msg.sender, vrfCoordinator);
        }
        fulfillRandomWords(requestId, randomWords);
    }
}

// ============ ERC20 Interface ============

interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
    function decimals() external view returns (uint8);
}

// ============ MAIN CONTRACT ============

contract MoltSpinRoulette is VRFConsumerBaseV2, ReentrancyGuard {
    // ============ CHAINLINK VRF ============
    
    VRFCoordinatorV2Interface public immutable VRF_COORDINATOR;
    uint64 public immutable subscriptionId;
    bytes32 public immutable keyHash;
    uint32 public constant CALLBACK_GAS_LIMIT = 500000;
    uint16 public constant REQUEST_CONFIRMATIONS = 3;
    uint32 public constant NUM_WORDS = 1;
    
    // ============ TOKENS ============
    
    IERC20 public immutable USDC;
    IERC20 public immutable SPIN;
    
    enum Token { USDC, SPIN }
    
    // ============ STATE VARIABLES ============
    
    address public owner;
    address public pendingOwner;
    
    // USDC min bets (6 decimals)
    uint256 public minBetStraightUSDC = 1_000_000;      // 1 USDC
    uint256 public minBetEvenMoneyUSDC = 5_000_000;     // 5 USDC
    uint256 public minBetDozenUSDC = 2_000_000;         // 2 USDC
    uint256 public maxBetUSDC = 1000_000_000;           // 1000 USDC
    
    // SPIN min bets (18 decimals)
    uint256 public minBetStraightSPIN = 1000 * 1e18;    // 1000 SPIN
    uint256 public minBetEvenMoneySPIN = 5000 * 1e18;   // 5000 SPIN
    uint256 public minBetDozenSPIN = 2000 * 1e18;       // 2000 SPIN
    uint256 public maxBetSPIN = 1_000_000 * 1e18;       // 1M SPIN
    
    uint256 public constant MAX_BETS_PER_BATCH = 10;
    uint256 public constant VRF_TIMEOUT = 1 hours;
    
    uint256 public nextBetId = 1;
    uint256 public nextBatchId = 1;
    
    mapping(uint8 => bool) public isRed;
    
    struct VRFRequest {
        uint256 batchId;
        bool exists;
    }
    mapping(uint256 => VRFRequest) public vrfRequests;
    
    // ============ STRUCTS ============
    
    enum BetType {
        Straight,      // 35:1
        Red,           // 1:1
        Black,         // 1:1
        Odd,           // 1:1
        Even,          // 1:1
        High,          // 1:1
        Low,           // 1:1
        Dozen1,        // 2:1
        Dozen2,        // 2:1
        Dozen3,        // 2:1
        Column1,       // 2:1
        Column2,       // 2:1
        Column3        // 2:1
    }
    
    struct Bet {
        uint256 id;
        uint256 batchId;
        address player;
        Token token;
        BetType betType;
        uint8 number;
        uint256 amount;
        uint256 timestamp;
        bool settled;
        uint8 result;
        uint256 payout;
    }
    
    struct BetBatch {
        uint256 id;
        address player;
        Token token;
        uint256[] betIds;
        uint256 totalAmount;
        uint256 totalPayout;
        uint256 timestamp;
        uint256 vrfRequestId;
        bool settled;
        bool refunded;
        uint8 result;
    }
    
    // ============ STORAGE ============
    
    mapping(uint256 => Bet) public bets;
    mapping(uint256 => BetBatch) public batches;
    mapping(address => uint256[]) public playerBets;
    mapping(address => uint256[]) public playerBatches;
    
    bool public paused;
    
    // ============ EVENTS ============
    
    event BetPlaced(uint256 indexed betId, uint256 indexed batchId, address indexed player, Token token, BetType betType, uint8 number, uint256 amount, uint256 timestamp);
    event BatchCreated(uint256 indexed batchId, address indexed player, Token token, uint256 betCount, uint256 totalAmount, uint256 vrfRequestId, uint256 timestamp);
    event SpinResult(uint256 indexed batchId, address indexed player, uint8 winningNumber, uint256 totalPayout, uint256 timestamp);
    event BetSettled(uint256 indexed betId, uint256 indexed batchId, bool won, uint256 payout);
    event BatchRefunded(uint256 indexed batchId, address indexed player, Token token, uint256 amount, uint256 timestamp);
    event HouseFunded(address indexed funder, Token token, uint256 amount);
    event HouseWithdrawal(address indexed owner, Token token, uint256 amount);
    event MinBetUpdated(Token token, BetType indexed betType, uint256 newMinBet);
    event MaxBetUpdated(Token token, uint256 newMaxBet);
    event PauseToggled(bool paused);
    event VRFRequested(uint256 indexed batchId, uint256 requestId);
    event VRFFulfilled(uint256 indexed requestId, uint256 randomWord);
    event OwnershipTransferInitiated(address indexed currentOwner, address indexed pendingOwner);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    
    // ============ ERRORS ============
    
    error BetTooLow();
    error BetTooHigh();
    error InvalidNumber();
    error InsufficientHouseBalance();
    error BatchAlreadySettled();
    error BatchAlreadyRefunded();
    error Unauthorized();
    error TransferFailed();
    error ContractPaused();
    error TooManyBets();
    error EmptyBatch();
    error InvalidBatchId();
    error VRFRequestNotFound();
    error InvalidMinBet();
    error RefundTooEarly();
    error NotBatchOwner();
    error NoPendingOwner();
    error NotPendingOwner();
    error ZeroAddress();
    
    // ============ CONSTRUCTOR ============
    
    constructor(
        address _usdc,
        address _spin,
        address _owner,
        address _vrfCoordinator,
        uint64 _subscriptionId,
        bytes32 _keyHash
    ) VRFConsumerBaseV2(_vrfCoordinator) {
        if (_usdc == address(0) || _spin == address(0) || _owner == address(0)) revert ZeroAddress();
        
        USDC = IERC20(_usdc);
        SPIN = IERC20(_spin);
        owner = _owner;
        VRF_COORDINATOR = VRFCoordinatorV2Interface(_vrfCoordinator);
        subscriptionId = _subscriptionId;
        keyHash = _keyHash;
        
        // Initialize red numbers
        isRed[1] = true; isRed[3] = true; isRed[5] = true; isRed[7] = true;
        isRed[9] = true; isRed[12] = true; isRed[14] = true; isRed[16] = true;
        isRed[18] = true; isRed[19] = true; isRed[21] = true; isRed[23] = true;
        isRed[25] = true; isRed[27] = true; isRed[30] = true; isRed[32] = true;
        isRed[34] = true; isRed[36] = true;
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
    
    // ============ BATCH BETTING ============
    
    struct BetInput {
        BetType betType;
        uint8 number;
        uint256 amount;
    }
    
    function placeBetsUSDC(BetInput[] calldata betInputs) external whenNotPaused nonReentrant returns (uint256) {
        return _placeBets(betInputs, Token.USDC);
    }
    
    function placeBetsSPIN(BetInput[] calldata betInputs) external whenNotPaused nonReentrant returns (uint256) {
        return _placeBets(betInputs, Token.SPIN);
    }
    
    function _placeBets(BetInput[] calldata betInputs, Token token) internal returns (uint256) {
        uint256 numBets = betInputs.length;
        if (numBets == 0) revert EmptyBatch();
        if (numBets > MAX_BETS_PER_BATCH) revert TooManyBets();
        
        IERC20 betToken = _getToken(token);
        uint256 batchId = nextBatchId++;
        uint256[] memory betIds = new uint256[](numBets);
        uint256 totalAmount = 0;
        uint256 maxPossiblePayout = 0;
        
        for (uint256 i = 0; i < numBets; i++) {
            BetInput calldata input = betInputs[i];
            
            _validateBet(input.betType, input.number, input.amount, token);
            
            uint256 betMaxPayout = _calculatePayout(input.betType, input.amount);
            maxPossiblePayout += betMaxPayout;
            
            uint256 betId = nextBetId++;
            bets[betId] = Bet({
                id: betId,
                batchId: batchId,
                player: msg.sender,
                token: token,
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
            
            emit BetPlaced(betId, batchId, msg.sender, token, input.betType, input.number, input.amount, block.timestamp);
        }
        
        if (betToken.balanceOf(address(this)) < maxPossiblePayout) revert InsufficientHouseBalance();
        if (!betToken.transferFrom(msg.sender, address(this), totalAmount)) revert TransferFailed();
        
        uint256 requestId = VRF_COORDINATOR.requestRandomWords(
            keyHash,
            subscriptionId,
            REQUEST_CONFIRMATIONS,
            CALLBACK_GAS_LIMIT,
            NUM_WORDS
        );
        
        vrfRequests[requestId] = VRFRequest({ batchId: batchId, exists: true });
        
        batches[batchId] = BetBatch({
            id: batchId,
            player: msg.sender,
            token: token,
            betIds: betIds,
            totalAmount: totalAmount,
            totalPayout: 0,
            timestamp: block.timestamp,
            vrfRequestId: requestId,
            settled: false,
            refunded: false,
            result: 0
        });
        
        playerBatches[msg.sender].push(batchId);
        
        emit BatchCreated(batchId, msg.sender, token, numBets, totalAmount, requestId, block.timestamp);
        emit VRFRequested(batchId, requestId);
        
        return batchId;
    }
    
    // ============ VRF CALLBACK ============
    
    function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords) internal override {
        VRFRequest storage vrfRequest = vrfRequests[requestId];
        if (!vrfRequest.exists) revert VRFRequestNotFound();
        
        uint256 batchId = vrfRequest.batchId;
        BetBatch storage batch = batches[batchId];
        
        if (batch.settled) revert BatchAlreadySettled();
        if (batch.refunded) revert BatchAlreadyRefunded();
        
        uint8 winningNumber = uint8(randomWords[0] % 38);
        batch.result = winningNumber;
        
        emit VRFFulfilled(requestId, randomWords[0]);
        
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
        
        if (totalPayout > 0) {
            IERC20 payoutToken = _getToken(batch.token);
            if (!payoutToken.transfer(batch.player, totalPayout)) revert TransferFailed();
        }
        
        emit SpinResult(batchId, batch.player, winningNumber, totalPayout, block.timestamp);
    }
    
    // ============ REFUND ============
    
    function refundStuckBatch(uint256 batchId) external nonReentrant {
        BetBatch storage batch = batches[batchId];
        
        if (batch.id == 0) revert InvalidBatchId();
        if (batch.settled) revert BatchAlreadySettled();
        if (batch.refunded) revert BatchAlreadyRefunded();
        if (msg.sender != batch.player) revert NotBatchOwner();
        if (block.timestamp < batch.timestamp + VRF_TIMEOUT) revert RefundTooEarly();
        
        batch.refunded = true;
        
        for (uint256 i = 0; i < batch.betIds.length; i++) {
            bets[batch.betIds[i]].settled = true;
        }
        
        IERC20 refundToken = _getToken(batch.token);
        if (!refundToken.transfer(batch.player, batch.totalAmount)) revert TransferFailed();
        
        emit BatchRefunded(batchId, batch.player, batch.token, batch.totalAmount, block.timestamp);
    }
    
    function canRefundBatch(uint256 batchId) external view returns (bool canRefund, uint256 timeUntilRefund) {
        BetBatch storage batch = batches[batchId];
        if (batch.id == 0 || batch.settled || batch.refunded) return (false, 0);
        uint256 refundTime = batch.timestamp + VRF_TIMEOUT;
        if (block.timestamp >= refundTime) return (true, 0);
        return (false, refundTime - block.timestamp);
    }
    
    // ============ INTERNAL ============
    
    function _getToken(Token token) internal view returns (IERC20) {
        return token == Token.USDC ? USDC : SPIN;
    }
    
    function _validateBet(BetType betType, uint8 number, uint256 amount, Token token) internal view {
        if (betType == BetType.Straight && number > 37) revert InvalidNumber();
        (uint256 minBet, uint256 maxBet) = _getBetLimits(betType, token);
        if (amount < minBet) revert BetTooLow();
        if (amount > maxBet) revert BetTooHigh();
    }
    
    function _getBetLimits(BetType betType, Token token) internal view returns (uint256 minBet, uint256 maxBet) {
        if (token == Token.USDC) {
            maxBet = maxBetUSDC;
            if (betType == BetType.Straight) minBet = minBetStraightUSDC;
            else if (_isEvenMoney(betType)) minBet = minBetEvenMoneyUSDC;
            else minBet = minBetDozenUSDC;
        } else {
            maxBet = maxBetSPIN;
            if (betType == BetType.Straight) minBet = minBetStraightSPIN;
            else if (_isEvenMoney(betType)) minBet = minBetEvenMoneySPIN;
            else minBet = minBetDozenSPIN;
        }
    }
    
    function _isEvenMoney(BetType betType) internal pure returns (bool) {
        return betType == BetType.Red || betType == BetType.Black ||
               betType == BetType.Odd || betType == BetType.Even ||
               betType == BetType.High || betType == BetType.Low;
    }
    
    function _checkWin(BetType betType, uint8 betNumber, uint8 result) internal view returns (bool) {
        if (betType == BetType.Straight) return betNumber == result;
        if (result == 0 || result == 37) return false;
        
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
        if (betType == BetType.Straight) return betAmount * 36;
        if (_isEvenMoney(betType)) return betAmount * 2;
        return betAmount * 3;
    }
    
    // ============ VIEW FUNCTIONS ============
    
    function getBet(uint256 betId) external view returns (Bet memory) { return bets[betId]; }
    function getBatch(uint256 batchId) external view returns (BetBatch memory) { return batches[batchId]; }
    function getPlayerBets(address player) external view returns (uint256[] memory) { return playerBets[player]; }
    function getPlayerBatches(address player) external view returns (uint256[] memory) { return playerBatches[player]; }
    function getHouseBalanceUSDC() external view returns (uint256) { return USDC.balanceOf(address(this)); }
    function getHouseBalanceSPIN() external view returns (uint256) { return SPIN.balanceOf(address(this)); }
    function getMinBetsUSDC() external view returns (uint256, uint256, uint256, uint256) { return (minBetStraightUSDC, minBetEvenMoneyUSDC, minBetDozenUSDC, maxBetUSDC); }
    function getMinBetsSPIN() external view returns (uint256, uint256, uint256, uint256) { return (minBetStraightSPIN, minBetEvenMoneySPIN, minBetDozenSPIN, maxBetSPIN); }
    function isRedNumber(uint8 number) external view returns (bool) { return isRed[number]; }
    
    function getBatchStatus(uint256 batchId) external view returns (bool exists, bool settled, bool refunded, Token token, uint256 timeElapsed) {
        BetBatch storage batch = batches[batchId];
        return (batch.id != 0, batch.settled, batch.refunded, batch.token, batch.timestamp > 0 ? block.timestamp - batch.timestamp : 0);
    }
    
    // ============ HOUSE FUNDING ============
    
    function fundHouseUSDC(uint256 amount) external {
        if (!USDC.transferFrom(msg.sender, address(this), amount)) revert TransferFailed();
        emit HouseFunded(msg.sender, Token.USDC, amount);
    }
    
    function fundHouseSPIN(uint256 amount) external {
        if (!SPIN.transferFrom(msg.sender, address(this), amount)) revert TransferFailed();
        emit HouseFunded(msg.sender, Token.SPIN, amount);
    }
    
    function withdrawHouseUSDC(uint256 amount) external onlyOwner {
        if (!USDC.transfer(owner, amount)) revert TransferFailed();
        emit HouseWithdrawal(owner, Token.USDC, amount);
    }
    
    function withdrawHouseSPIN(uint256 amount) external onlyOwner {
        if (!SPIN.transfer(owner, amount)) revert TransferFailed();
        emit HouseWithdrawal(owner, Token.SPIN, amount);
    }
    
    function emergencyWithdrawUSDC() external onlyOwner {
        uint256 balance = USDC.balanceOf(address(this));
        if (!USDC.transfer(owner, balance)) revert TransferFailed();
        emit HouseWithdrawal(owner, Token.USDC, balance);
    }
    
    function emergencyWithdrawSPIN() external onlyOwner {
        uint256 balance = SPIN.balanceOf(address(this));
        if (!SPIN.transfer(owner, balance)) revert TransferFailed();
        emit HouseWithdrawal(owner, Token.SPIN, balance);
    }
    
    // ============ ADMIN SETTERS ============
    
    function setMinBetStraightUSDC(uint256 v) external onlyOwner { if (v == 0 || v > maxBetUSDC) revert InvalidMinBet(); minBetStraightUSDC = v; emit MinBetUpdated(Token.USDC, BetType.Straight, v); }
    function setMinBetEvenMoneyUSDC(uint256 v) external onlyOwner { if (v == 0 || v > maxBetUSDC) revert InvalidMinBet(); minBetEvenMoneyUSDC = v; emit MinBetUpdated(Token.USDC, BetType.Red, v); }
    function setMinBetDozenUSDC(uint256 v) external onlyOwner { if (v == 0 || v > maxBetUSDC) revert InvalidMinBet(); minBetDozenUSDC = v; emit MinBetUpdated(Token.USDC, BetType.Dozen1, v); }
    function setMaxBetUSDC(uint256 v) external onlyOwner { if (v == 0) revert InvalidMinBet(); maxBetUSDC = v; emit MaxBetUpdated(Token.USDC, v); }
    
    function setMinBetStraightSPIN(uint256 v) external onlyOwner { if (v == 0 || v > maxBetSPIN) revert InvalidMinBet(); minBetStraightSPIN = v; emit MinBetUpdated(Token.SPIN, BetType.Straight, v); }
    function setMinBetEvenMoneySPIN(uint256 v) external onlyOwner { if (v == 0 || v > maxBetSPIN) revert InvalidMinBet(); minBetEvenMoneySPIN = v; emit MinBetUpdated(Token.SPIN, BetType.Red, v); }
    function setMinBetDozenSPIN(uint256 v) external onlyOwner { if (v == 0 || v > maxBetSPIN) revert InvalidMinBet(); minBetDozenSPIN = v; emit MinBetUpdated(Token.SPIN, BetType.Dozen1, v); }
    function setMaxBetSPIN(uint256 v) external onlyOwner { if (v == 0) revert InvalidMinBet(); maxBetSPIN = v; emit MaxBetUpdated(Token.SPIN, v); }
    
    function togglePause() external onlyOwner { paused = !paused; emit PauseToggled(paused); }
    
    // ============ OWNERSHIP ============
    
    function transferOwnership(address newOwner) external onlyOwner {
        if (newOwner == address(0)) revert ZeroAddress();
        pendingOwner = newOwner;
        emit OwnershipTransferInitiated(owner, newOwner);
    }
    
    function acceptOwnership() external {
        if (pendingOwner == address(0)) revert NoPendingOwner();
        if (msg.sender != pendingOwner) revert NotPendingOwner();
        address oldOwner = owner;
        owner = pendingOwner;
        pendingOwner = address(0);
        emit OwnershipTransferred(oldOwner, owner);
    }
}
