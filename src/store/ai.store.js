import { create } from 'zustand';

const MAX_TOKENS = 50000;

const useAIStore = create((set, get) => ({
  selectedModel: 'flash',
  virtualTokens: MAX_TOKENS,
  maxTokens: MAX_TOKENS,
  nextResetAt: null,
  
  setSelectedModel: (model) => set({ selectedModel: model }),
  setVirtualTokens: (tokens) => set({ virtualTokens: tokens }),
  setNextResetAt: (dateString) => set({ nextResetAt: dateString }),
  deductTokens: (amount) => set((state) => ({ 
    virtualTokens: Math.max(0, state.virtualTokens - amount) 
  })),
  isTokensExhausted: () => get().virtualTokens <= 0,
}));

export default useAIStore;
