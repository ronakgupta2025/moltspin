'use client';

import { GameProvider } from '@/components/GameProvider';
import PlayHeader from '@/components/PlayHeader';
import RouletteWheelPro from '@/components/RouletteWheelPro';
import CasinoBettingTable from '@/components/CasinoBettingTable';
import BettingControls from '@/components/BettingControls';
import GameInfo from '@/components/GameInfo';
import StatsPanel from '@/components/StatsPanel';
import SoundManager from '@/components/SoundManager';
import ResultModal from '@/components/ResultModal';

export default function PlayPage() {
  return (
    <GameProvider>
      <SoundManager />
      <ResultModal />
      <div className="min-h-screen bg-gradient-to-br from-background via-surface/50 to-background">
        {/* Header */}
        <PlayHeader />
        
        {/* Main Game Area */}
        <main className="container mx-auto px-4 py-6">
          {/* Top Section: Wheel + Info */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Wheel (takes 2 columns) */}
            <div className="lg:col-span-2">
              <RouletteWheelPro />
            </div>
            
            {/* Game Info Sidebar */}
            <div className="space-y-4">
              <GameInfo />
              <StatsPanel />
            </div>
          </div>
          
          {/* Betting Table */}
          <div className="mb-6">
            <CasinoBettingTable />
          </div>
          
          {/* Betting Controls */}
          <div className="mb-6">
            <BettingControls />
          </div>
        </main>
      </div>
    </GameProvider>
  );
}
