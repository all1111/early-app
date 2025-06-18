"use client";

import * as React from "react";
import { createContext, useContext, useReducer, useEffect } from "react";

interface Article {
  title: string;
  titleJa: string;
  descriptionJa: string;
  insightJa: string;
  impactJa: string;
  audioScript: string;
  url: string;
  image: string;
  publishedAt: string;
  country: string;
}

interface AppState {
  currentScreen: 'splash' | 'home' | 'article' | 'podcast' | 'settings';
  selectedArticle: Article | null;
  isLoading: boolean;
  audioPlaying: boolean;
  bottomNavVisible: boolean;
}

type AppAction =
  | { type: 'SET_SCREEN'; payload: AppState['currentScreen'] }
  | { type: 'SELECT_ARTICLE'; payload: Article | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_AUDIO_PLAYING'; payload: boolean }
  | { type: 'SET_BOTTOM_NAV_VISIBLE'; payload: boolean };

const initialState: AppState = {
  currentScreen: 'splash',
  selectedArticle: null,
  isLoading: false,
  audioPlaying: false,
  bottomNavVisible: true,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_SCREEN':
      return { ...state, currentScreen: action.payload };
    case 'SELECT_ARTICLE':
      return { ...state, selectedArticle: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_AUDIO_PLAYING':
      return { ...state, audioPlaying: action.payload };
    case 'SET_BOTTOM_NAV_VISIBLE':
      return { ...state, bottomNavVisible: action.payload };
    default:
      return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    // スプラッシュ画面を3秒後にホーム画面に切り替え
    if (state.currentScreen === 'splash') {
      const timer = setTimeout(() => {
        dispatch({ type: 'SET_SCREEN', payload: 'home' });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [state.currentScreen]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}