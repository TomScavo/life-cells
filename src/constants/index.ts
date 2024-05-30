import Taro from '@tarojs/taro';

export * from './media';
export * from './route';

export enum Store {
    Birthday = 'birthday',
    Goals = 'goals',
    TodayGoals = 'todayGoals',
    EverydayGoals = 'everydayGoals',
    ExecutingGoal = 'executingGoal',
    LoopType = 'loopType',
    EncourageConfig = 'encourageConfig',
    GoalType = 'goalType',
}

export const audioContext = Taro.getBackgroundAudioManager();
audioContext.title = 'Unknow';
audioContext.singer = 'Unknow';

export const serverEncourageVoicesDir = "https://lifecells.top/encourage-voices/";
export const serverEncourageVoicesTimeDir = "https://lifecells.top/encourage-voices/a-time/";
export const serverEncourageVoicesNumberDir = "https://lifecells.top/encourage-voices/a-time/numbers/";
export const serverEncourageVoicesProgressDir = "https://lifecells.top/encourage-voices/b-progress/";
export const serverEncourageVoicesAnimalDir = "https://lifecells.top/encourage-voices/e-animal/";
// export const serverEncourageVoicesComplimentDir = "https://lifecells.top/encourage-voices/a-time/number";
// export const serverEncourageVoicesEncourageDir = "https://lifecells.top/encourage-voices/a-time/number";
// export const serverEncourageVoicesAnimalDir = "https://lifecells.top/encourage-voices/a-time/number";

export const encourageVoices: any = {
    start: serverEncourageVoicesDir + 'start.mp3',
    continue: serverEncourageVoicesDir + 'continue.mp3',
    pause: serverEncourageVoicesDir + 'pause.mp3',
    point: serverEncourageVoicesNumberDir + 'point.mp3',
    numberPrefix: serverEncourageVoicesTimeDir + 'prefix.mp3',
    hour: serverEncourageVoicesTimeDir + 'hour.mp3',
    minute: serverEncourageVoicesTimeDir + 'minute.mp3',
    second: serverEncourageVoicesTimeDir + 'second.mp3',
    progressPrefix: serverEncourageVoicesProgressDir + 'prefix.mp3',
    cat: serverEncourageVoicesAnimalDir + 'cat.mp3',
    bunny: serverEncourageVoicesAnimalDir + 'bunny.mp3',
    penguin: serverEncourageVoicesAnimalDir + 'penguin.mp3',
    ghost: serverEncourageVoicesAnimalDir + 'ghost.mp3',
    others: serverEncourageVoicesAnimalDir + 'others.mp3',
    chicken: serverEncourageVoicesAnimalDir + 'chicken.mp3',
    talk: serverEncourageVoicesAnimalDir + 'wanna-talk.mp3',
    finishPrefix: serverEncourageVoicesDir + 'finish-prefix.mp3',
    finishProgressPrefix: serverEncourageVoicesDir + 'finish-progress-prefix.mp3',
    usedTimePrefix: serverEncourageVoicesDir + 'used-time-prefix.mp3',
    goalFinished: serverEncourageVoicesDir + 'goal-finished.mp3',
    twoForTime: serverEncourageVoicesNumberDir + '2-time.mp3'
}

const numbers = [0,1,2,3,4,5,6,7,8,9,10,20,30,40,50,60,70,80,90,100];

numbers.forEach(n => {
    encourageVoices[`${n}`] = serverEncourageVoicesNumberDir + `${n}.mp3` as any;
})