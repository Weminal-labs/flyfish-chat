import { create } from "zustand";

// Import types
import type { KnowledgeType } from "src/objects/knowledge/types";

type KnowledgeState = {
  list: Array<KnowledgeType>;
};

type KnowledgeActions = {
  setListKnowledge(listKnowledge: Array<KnowledgeType>): void;
  reset(): void;
};

const initialState: KnowledgeState = {
  list: [],
};

export const useKnowledgeState = create<KnowledgeState & KnowledgeActions>(
  (set) => {
    return {
      ...initialState,
      setListKnowledge(listKnowledge: Array<KnowledgeType> = []) {
        set((state) => ({ ...state, list: listKnowledge }));
      },
      reset() {
        set(() => ({ ...initialState }));
      },
    };
  }
);
