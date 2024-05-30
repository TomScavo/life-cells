
export interface Log {
    timestamp: string,
    duration: string,
    increasedValue: number
}

export interface Goal {
    everydayGoalRef?: string;
    parentId: string;
    id: string;
    goal: string;
    task: string;
    total: number;
    unit: string;
    isEveryday: boolean;
    finished: number;
    logs: Log[];
    animal: {
        name: string;
        imageUrl: string;
        voiceUrl: string;
    }
}

export type EverydayGoal = Omit<Goal, 'id' | 'everydayGoalRef' | 'finished' | 'logs' | 'isEveryday' | 'parentId'>

// export type EverydayGoals = EverydayGoal[];
export type EverydayGoals = {
    [key: string]:  EverydayGoal
};

export interface EncourageConfig {
    isPlayAudio: boolean;
    isPlayProgress: boolean;
    isPlayEncourage: boolean;
    isPlayCompliment: boolean;
    isPlayAnimalAudio: boolean;
    intervalTime: number;
    backgroundOpacity: number;
    isShowConsumeLife: boolean;
    isShowBackgroundImage: boolean;
    isShowSubtitle: boolean;
    isShowHero: boolean;
    customImages: string[];
    selectedImage: string;
    selectedHero: string;
    selectedPrincess: string;
}

export interface ExecutingGoal {
    selectedGoal: State['selectedGoal'],
    isExecuting: boolean,
    isPaused: boolean,
    startTimestamp: number,
    finishedTimeSlice: number
}

export enum GoalType {
    Today = 'today',
    LifeTime = 'lifeTime',
    EverydayGoals = 'everydayGoals',
}

export type TodayGoals = { [key: string]: Goal[]};

export interface State {
    goals: Goal[];
    everydayGoals: EverydayGoals;
    anime: {} | { princess: string[], heros: string[], dragons: string[] };
    todayGoals: TodayGoals;
    goalType: GoalType;
    selectedGoal: Goal & { index: number, date: string } | null;
    isEdit: boolean;
    isOnline: boolean;
    executingGoal: ExecutingGoal;
    encourageConfig: EncourageConfig;
}

export enum UpdateFinishedType {
    Increase = 'increase',
    Decrease = 'decrease'
}
