import { ExecutingGoal, EncourageConfig } from "../../store/types/goals"

export interface Args {
    executingGoalRef: React.MutableRefObject<ExecutingGoal>;
    encouragesRef: React.MutableRefObject<{
      compliments: string[];
      encourages: string[];
    }>;
    reportedMinutesRef: React.MutableRefObject<any[]>;
    encourageConfig: EncourageConfig;
    selectedGoalRef: React.MutableRefObject<any>;
    finished: number;
    total: number;
    decimalLength: number;
    animalsRef: React.MutableRefObject<any[]>;
    setCurrentAnimal: React.Dispatch<React.SetStateAction<{
        name: string;
        imageUrl: string;
        voiceUrl: string;
      }>>;
    currentPlayingAudioContextsRef:React.MutableRefObject<Taro.InnerAudioContext[]>;
    currentPlayingAudioContextRef: React.MutableRefObject<Taro.InnerAudioContext | null>;
    showPlayBar: boolean;
    setShowAnimalEncourage: React.Dispatch<React.SetStateAction<boolean>>;
    isPlayingAnimalAudioRef: React.MutableRefObject<boolean>;
    audioRef: React.MutableRefObject<Taro.BackgroundAudioManager>;
    animals: any[];
    currentAnimal: {
      name: string;
      imageUrl: string;
      voiceUrl: string;
    };
    currentAnimalRef: React.MutableRefObject<any>;
    setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
    stopCurrentAudio: () => void;
    setToast: React.Dispatch<React.SetStateAction<{
      duration: number;
      text: string;
    }>>,
    isExecuting: boolean;
    isPaused: boolean;
    executingTimer: any;
    setExecutingTime: React.Dispatch<React.SetStateAction<string>>,
    executingGoal: ExecutingGoal;
    setShowTimerCover: React.Dispatch<React.SetStateAction<boolean>>;
    executingTime: string;
    setShowAddProgressModal: React.Dispatch<React.SetStateAction<boolean>>;
    showTimerCover: boolean;
    isPlaying: boolean;
    isPlayingRef: React.MutableRefObject<boolean>;
    showAnimalEncourage: boolean;
    currentSubtitle: string;
  }