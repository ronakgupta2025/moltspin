// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../MoltSpinRoulette.sol";

/**
 * @title DeployMoltSpin
 * @notice Deployment script for MoltSpin Roulette on Base
 * 
 * Usage:
 * 1. Set environment variables:
 *    export PRIVATE_KEY=your_private_key
 *    export BASESCAN_API_KEY=your_basescan_key
 * 
 * 2. Deploy to Base mainnet:
 *    forge script script/DeployMoltSpin.s.sol:DeployMoltSpin \
 *      --rpc-url https://mainnet.base.org \
 *      --broadcast \
 *      --verify
 * 
 * 3. Deploy to Base Sepolia (testnet):
 *    forge script script/DeployMoltSpin.s.sol:DeployMoltSpin \
 *      --rpc-url https://sepolia.base.org \
 *      --broadcast \
 *      --verify
 */
contract DeployMoltSpin is Script {
    // ============ BASE MAINNET ADDRESSES ============
    
    // USDC on Base
    address constant USDC_BASE = 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913;
    
    // SPIN token on Base (Clanker deployed)
    address constant SPIN_BASE = 0x0e77F5Fd459d080EEc6C6A5cB903F66D2af1Cb07;
    
    // Chainlink VRF V2 on Base
    // Note: As of 2024, Base mainnet VRF may require checking latest addresses
    // https://docs.chain.link/vrf/v2/subscription/supported-networks
    address constant VRF_COORDINATOR_BASE = 0xd5D517aBE5cF79B7e95eC98dB0f0277788aFF634;
    bytes32 constant KEY_HASH_BASE = 0x354d2f95da55398f44b7cff77da56283d9c6c829a4bdf1bbcaf2ad6a4d081f61; // 150 gwei
    
    // ============ BASE SEPOLIA (TESTNET) ADDRESSES ============
    
    // USDC on Base Sepolia (mock - you may need to deploy your own)
    address constant USDC_SEPOLIA = 0x036CbD53842c5426634e7929541eC2318f3dCF7e;
    
    // For testnet, deploy a mock SPIN or use USDC for both
    address constant SPIN_SEPOLIA = address(0); // Set after deploying mock
    
    // Chainlink VRF V2 on Base Sepolia
    address constant VRF_COORDINATOR_SEPOLIA = 0x5C210eF41CD1a72de73bF76eC39637bB0d3d7BEE;
    bytes32 constant KEY_HASH_SEPOLIA = 0xc799bd1e3bd4d1a41cd4968997a4e03dfd2a3c7c04b695881138580163f42887;
    
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);
        
        // Detect network
        uint256 chainId = block.chainid;
        
        address usdc;
        address spin;
        address vrfCoordinator;
        bytes32 keyHash;
        uint64 subscriptionId;
        
        if (chainId == 8453) {
            // Base Mainnet
            console.log("Deploying to Base Mainnet...");
            usdc = USDC_BASE;
            spin = SPIN_BASE;
            vrfCoordinator = VRF_COORDINATOR_BASE;
            keyHash = KEY_HASH_BASE;
            subscriptionId = uint64(vm.envUint("VRF_SUBSCRIPTION_ID"));
        } else if (chainId == 84532) {
            // Base Sepolia
            console.log("Deploying to Base Sepolia...");
            usdc = USDC_SEPOLIA;
            spin = SPIN_SEPOLIA != address(0) ? SPIN_SEPOLIA : USDC_SEPOLIA; // Use USDC as mock SPIN
            vrfCoordinator = VRF_COORDINATOR_SEPOLIA;
            keyHash = KEY_HASH_SEPOLIA;
            subscriptionId = uint64(vm.envUint("VRF_SUBSCRIPTION_ID"));
        } else {
            revert("Unsupported chain");
        }
        
        console.log("Deployer:", deployer);
        console.log("USDC:", usdc);
        console.log("SPIN:", spin);
        console.log("VRF Coordinator:", vrfCoordinator);
        console.log("Subscription ID:", subscriptionId);
        
        vm.startBroadcast(deployerPrivateKey);
        
        MoltSpinRoulette roulette = new MoltSpinRoulette(
            usdc,
            spin,
            deployer,  // owner
            vrfCoordinator,
            subscriptionId,
            keyHash
        );
        
        vm.stopBroadcast();
        
        console.log("===============================");
        console.log("MoltSpin Roulette deployed at:", address(roulette));
        console.log("===============================");
        console.log("");
        console.log("Next steps:");
        console.log("1. Add contract as VRF consumer: https://vrf.chain.link");
        console.log("2. Fund house with USDC: roulette.fundHouseUSDC(amount)");
        console.log("3. Fund house with SPIN: roulette.fundHouseSPIN(amount)");
        console.log("4. Update frontend CONTRACT_ADDRESS");
    }
}
