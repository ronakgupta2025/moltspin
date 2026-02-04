// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@chainlink/contracts/src/v0.8/vrf/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title MoltSpin Roulette - American Roulette on Base
 * @notice Provably fair roulette with USDC + SPIN token support
 * 
 * Constructor Parameters (Base Mainnet):
 * - _usdc:           0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913
 * - _spin:           0x0e77F5Fd459d080EEc6C6A5cB903F66D2af1Cb07
 * - _owner:          YOUR_WALLET_ADDRESS
 * - _vrfCoordinator: 0xd5D517aBE5cF79B7e95eC98dB0f0277788aFF634
 * - _subscriptionId: YOUR_VRF_SUBSCRIPTION_ID
 * - _keyHash:        0x354d2f95da55398f44b7cff77da56283d9c6c829a4bdf1bbcaf2ad6a4d081f61
 */

interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

contract MoltSpinRoulette is VRFConsumerBaseV2, ReentrancyGuard {
    
    VRFCoordinatorV2Interface public immutable VRF_COORDINATOR;
    uint64 public immutable subscriptionId;
    bytes32 public immutable keyHash;
    
    IERC20 public immutable USDC;
    IERC20 public immutable SPIN;
    
    address public owner;
    address public pendingOwner;
    bool public paused;
    
    // USDC limits (6 decimals)
    uint256 public minBetStraightUSDC = 1e6;
    uint256 public minBetEvenMoneyUSDC = 5e6;
    uint256 public minBetDozenUSDC = 2e6;
    uint256 public maxBetUSDC = 1000e6;
    
    // SPIN limits (18 decimals)
    uint256 public minBetStraightSPIN = 1000e18;
    uint256 public minBetEvenMoneySPIN = 5000e18;
    uint256 public minBetDozenSPIN = 2000e18;
    uint256 public maxBetSPIN = 1_000_000e18;
    
    uint256 public nextBetId = 1;
    uint256 public nextBatchId = 1;
    
    struct VRFRequest { uint256 batchId; bool exists; }
    
    struct Bet {
        address player;
        uint8 token;
        uint8 betType;
        uint8 number;
        uint8 result;
        bool settled;
        uint256 amount;
        uint256 payout;
    }
    
    struct BetBatch {
        address player;
        uint8 token;
        uint8 result;
        bool settled;
        bool refunded;
        uint256 totalAmount;
        uint256 totalPayout;
        uint256 timestamp;
        uint256[] betIds;
    }
    
    struct BetInput { uint8 betType; uint8 number; uint256 amount; }
    
    mapping(uint256 => VRFRequest) public vrfRequests;
    mapping(uint256 => Bet) public bets;
    mapping(uint256 => BetBatch) public batches;
    mapping(address => uint256[]) public playerBatches;
    
    event BetPlaced(uint256 indexed betId, uint256 indexed batchId, address indexed player, uint8 token, uint8 betType, uint256 amount);
    event BatchCreated(uint256 indexed batchId, address indexed player, uint8 token, uint256 totalAmount, uint256 vrfRequestId);
    event SpinResult(uint256 indexed batchId, address indexed player, uint8 winningNumber, uint256 totalPayout);
    event BatchRefunded(uint256 indexed batchId, address indexed player, uint256 amount);
    event HouseFunded(address indexed funder, uint8 token, uint256 amount);
    event HouseWithdrawal(address indexed to, uint8 token, uint256 amount);
    
    error Unauthorized();
    error TransferFailed();
    error ContractPaused();
    error InvalidBet();
    error InsufficientHouseBalance();
    error BatchAlreadySettled();
    error RefundTooEarly();
    error ZeroAddress();
    
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
    }
    
    modifier onlyOwner() { if (msg.sender != owner) revert Unauthorized(); _; }
    modifier whenNotPaused() { if (paused) revert ContractPaused(); _; }
    
    // ============ BETTING ============
    
    function placeBetsUSDC(BetInput[] calldata inputs) external whenNotPaused nonReentrant returns (uint256) {
        return _placeBets(inputs, 0);
    }
    
    function placeBetsSPIN(BetInput[] calldata inputs) external whenNotPaused nonReentrant returns (uint256) {
        return _placeBets(inputs, 1);
    }
    
    function _placeBets(BetInput[] calldata inputs, uint8 token) internal returns (uint256) {
        uint256 len = inputs.length;
        if (len == 0 || len > 10) revert InvalidBet();
        
        uint256 batchId = nextBatchId++;
        uint256[] memory betIds = new uint256[](len);
        uint256 total;
        uint256 maxPayout;
        
        for (uint256 i; i < len;) {
            uint256 betId = _createBet(inputs[i], token, batchId);
            betIds[i] = betId;
            total += inputs[i].amount;
            maxPayout += _payout(inputs[i].betType, inputs[i].amount);
            unchecked { ++i; }
        }
        
        IERC20 tkn = token == 0 ? USDC : SPIN;
        if (tkn.balanceOf(address(this)) < maxPayout) revert InsufficientHouseBalance();
        if (!tkn.transferFrom(msg.sender, address(this), total)) revert TransferFailed();
        
        uint256 reqId = VRF_COORDINATOR.requestRandomWords(keyHash, subscriptionId, 3, 500000, 1);
        vrfRequests[reqId] = VRFRequest(batchId, true);
        
        batches[batchId] = BetBatch({
            player: msg.sender,
            token: token,
            result: 0,
            settled: false,
            refunded: false,
            totalAmount: total,
            totalPayout: 0,
            timestamp: block.timestamp,
            betIds: betIds
        });
        
        playerBatches[msg.sender].push(batchId);
        emit BatchCreated(batchId, msg.sender, token, total, reqId);
        return batchId;
    }
    
    function _createBet(BetInput calldata inp, uint8 token, uint256 batchId) internal returns (uint256) {
        if (inp.betType == 0 && inp.number > 37) revert InvalidBet();
        
        (uint256 minB, uint256 maxB) = _limits(inp.betType, token);
        if (inp.amount < minB || inp.amount > maxB) revert InvalidBet();
        
        uint256 betId = nextBetId++;
        bets[betId] = Bet({
            player: msg.sender,
            token: token,
            betType: inp.betType,
            number: inp.number,
            result: 0,
            settled: false,
            amount: inp.amount,
            payout: 0
        });
        
        emit BetPlaced(betId, batchId, msg.sender, token, inp.betType, inp.amount);
        return betId;
    }
    
    // ============ VRF CALLBACK ============
    
    function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords) internal override {
        VRFRequest storage req = vrfRequests[requestId];
        if (!req.exists) return;
        
        BetBatch storage batch = batches[req.batchId];
        if (batch.settled || batch.refunded) revert BatchAlreadySettled();
        
        uint8 win = uint8(randomWords[0] % 38);
        batch.result = win;
        batch.settled = true;
        
        uint256 payout = _settleBets(batch.betIds, win);
        batch.totalPayout = payout;
        
        if (payout > 0) {
            IERC20 tkn = batch.token == 0 ? USDC : SPIN;
            if (!tkn.transfer(batch.player, payout)) revert TransferFailed();
        }
        
        emit SpinResult(req.batchId, batch.player, win, payout);
    }
    
    function _settleBets(uint256[] storage ids, uint8 win) internal returns (uint256 payout) {
        for (uint256 i; i < ids.length;) {
            Bet storage b = bets[ids[i]];
            b.result = win;
            b.settled = true;
            if (_checkWin(b.betType, b.number, win)) {
                b.payout = _payout(b.betType, b.amount);
                payout += b.payout;
            }
            unchecked { ++i; }
        }
    }
    
    // ============ REFUND ============
    
    function refundStuckBatch(uint256 batchId) external nonReentrant {
        BetBatch storage batch = batches[batchId];
        if (batch.settled || batch.refunded) revert BatchAlreadySettled();
        if (msg.sender != batch.player) revert Unauthorized();
        if (block.timestamp < batch.timestamp + 1 hours) revert RefundTooEarly();
        
        batch.refunded = true;
        IERC20 tkn = batch.token == 0 ? USDC : SPIN;
        if (!tkn.transfer(batch.player, batch.totalAmount)) revert TransferFailed();
        
        emit BatchRefunded(batchId, batch.player, batch.totalAmount);
    }
    
    // ============ INTERNAL ============
    
    function _limits(uint8 betType, uint8 token) internal view returns (uint256 minB, uint256 maxB) {
        if (token == 0) {
            maxB = maxBetUSDC;
            minB = betType == 0 ? minBetStraightUSDC : (betType < 7 ? minBetEvenMoneyUSDC : minBetDozenUSDC);
        } else {
            maxB = maxBetSPIN;
            minB = betType == 0 ? minBetStraightSPIN : (betType < 7 ? minBetEvenMoneySPIN : minBetDozenSPIN);
        }
    }
    
    function _isRed(uint8 n) internal pure returns (bool) {
        if (n == 0 || n > 36) return false;
        uint256 reds = 0x0002A54A952A4; // bitmap for red numbers
        return ((reds >> n) & 1) == 1;
    }
    
    function _checkWin(uint8 betType, uint8 num, uint8 res) internal pure returns (bool) {
        if (betType == 0) return num == res;
        if (res == 0 || res == 37) return false;
        if (betType == 1) return _isRed(res);
        if (betType == 2) return !_isRed(res);
        if (betType == 3) return res % 2 == 1;
        if (betType == 4) return res % 2 == 0;
        if (betType == 5) return res >= 19;
        if (betType == 6) return res <= 18;
        if (betType == 7) return res <= 12;
        if (betType == 8) return res >= 13 && res <= 24;
        if (betType == 9) return res >= 25;
        if (betType == 10) return res % 3 == 1;
        if (betType == 11) return res % 3 == 2;
        if (betType == 12) return res % 3 == 0;
        return false;
    }
    
    function _payout(uint8 betType, uint256 amt) internal pure returns (uint256) {
        if (betType == 0) return amt * 36;
        if (betType < 7) return amt * 2;
        return amt * 3;
    }
    
    // ============ VIEW ============
    
    function getBet(uint256 id) external view returns (Bet memory) { return bets[id]; }
    function getBatch(uint256 id) external view returns (BetBatch memory) { return batches[id]; }
    function getPlayerBatches(address p) external view returns (uint256[] memory) { return playerBatches[p]; }
    function houseBalanceUSDC() external view returns (uint256) { return USDC.balanceOf(address(this)); }
    function houseBalanceSPIN() external view returns (uint256) { return SPIN.balanceOf(address(this)); }
    
    // ============ HOUSE ============
    
    function fundHouseUSDC(uint256 amt) external {
        if (!USDC.transferFrom(msg.sender, address(this), amt)) revert TransferFailed();
        emit HouseFunded(msg.sender, 0, amt);
    }
    
    function fundHouseSPIN(uint256 amt) external {
        if (!SPIN.transferFrom(msg.sender, address(this), amt)) revert TransferFailed();
        emit HouseFunded(msg.sender, 1, amt);
    }
    
    function withdrawUSDC(uint256 amt) external onlyOwner {
        if (!USDC.transfer(owner, amt)) revert TransferFailed();
        emit HouseWithdrawal(owner, 0, amt);
    }
    
    function withdrawSPIN(uint256 amt) external onlyOwner {
        if (!SPIN.transfer(owner, amt)) revert TransferFailed();
        emit HouseWithdrawal(owner, 1, amt);
    }
    
    // ============ ADMIN ============
    
    function setMinBetsUSDC(uint256 straight, uint256 even, uint256 dozen, uint256 max) external onlyOwner {
        minBetStraightUSDC = straight;
        minBetEvenMoneyUSDC = even;
        minBetDozenUSDC = dozen;
        maxBetUSDC = max;
    }
    
    function setMinBetsSPIN(uint256 straight, uint256 even, uint256 dozen, uint256 max) external onlyOwner {
        minBetStraightSPIN = straight;
        minBetEvenMoneySPIN = even;
        minBetDozenSPIN = dozen;
        maxBetSPIN = max;
    }
    
    function togglePause() external onlyOwner { paused = !paused; }
    
    function transferOwnership(address newOwner) external onlyOwner {
        if (newOwner == address(0)) revert ZeroAddress();
        pendingOwner = newOwner;
    }
    
    function acceptOwnership() external {
        if (msg.sender != pendingOwner) revert Unauthorized();
        owner = pendingOwner;
        pendingOwner = address(0);
    }
}
