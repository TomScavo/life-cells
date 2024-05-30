import moment from "moment";
import pick from 'lodash-es/pick';
import omit from 'lodash-es/omit';

import { createSlice,PayloadAction } from "@reduxjs/toolkit";

import {
    saveGoals,
    saveGoalType,
    saveTodayGoals,
    saveExecutingGoal,
    saveEncourageConfig,
    removeExecutingGoal,
    getSortedGoals,
    saveEverydayGoals,
    addTodayGoal,
    addEverydayGoal,
    deleteEverydayGoal
} from './utils/goals'

import {
    Log,
    Goal,
    EverydayGoal,
    EverydayGoals,
    EncourageConfig,
    ExecutingGoal,
    GoalType,
    TodayGoals,
    State,
    UpdateFinishedType,
} from './types/goals'

import { uuid } from '../utils'

import { getMusicCoverImage } from "../utils";

export const defaultExecutingGoal = {
    selectedGoal: null,
    isExecuting: false,
    isPaused: false,
    startTimestamp: 0,
    finishedTimeSlice: 0
}

const initialState: State = {
    goals: [],
    todayGoals: {},
    everydayGoals: {},
    goalType: GoalType.Today,
    selectedGoal: null,
    anime: {},
    isEdit: false,
    isOnline: false,
    executingGoal: defaultExecutingGoal,
    encourageConfig: {
        isPlayAudio: true,
        isPlayProgress: true,
        isPlayEncourage: true,
        isPlayCompliment: true,
        isPlayAnimalAudio: true,
        isShowSubtitle: true,
        intervalTime: 1,
        backgroundOpacity: 40,
        isShowConsumeLife: true,
        isShowBackgroundImage: true,
        isShowHero: true,
        customImages: [],
        selectedImage: getMusicCoverImage(0),
        selectedHero: '',
        selectedPrincess: ''
    }
}

export const goals = createSlice({
  // 命名空间，在调用action的时候会默认的设置为action的前缀
  name: "goals",
  // 初始值
  initialState,
  // 这里的属性会自动的导出为actions，在组件中可以直接通过dispatch进行触发
  reducers: {
    initGoals(state, { payload }: PayloadAction<Goal[]>) {
        state.goals = payload;
        saveGoals(state.goals);
    },
    initTodayGoals(state, { payload }: PayloadAction<State['todayGoals']>) {
        state.todayGoals = payload;
    },
    initEverydayGoals(state, { payload }: PayloadAction<EverydayGoals>) {
        state.everydayGoals = payload;
    },
    updateGoalType(state, { payload }: PayloadAction<GoalType>) {
        state.goalType = payload;
        saveGoalType(payload);
    },
    addGoal(state, { payload }: PayloadAction<Omit<Goal, 'finished' | 'logs' | 'id' | 'everydayGoalRef' >>) {
        const defaultValues = { id: uuid(), finished: 0, logs: [] };

        if (state.goalType === GoalType.Today) {
            addTodayGoal({
                state,
                payload,
                defaultValues
            })
        } else {
            state.goals = [{...payload, ...defaultValues}, ...state.goals];
            saveGoals(state.goals);
        }
    },
    updateGoal(state, { payload: {index, data} }: PayloadAction<{index: number, data: Omit<Goal, 'finished' | 'logs' | 'id' | 'everydayGoalRef'>}>){
      const { finished, logs, id, date } = state.selectedGoal!;

      if (state.goalType === GoalType.Today) {
        const goals = state.todayGoals[date];
        const goal = goals[index];
        const isUpdateEverydayGoal = goal.isEveryday && data.isEveryday;
        const isAddEverydayGoal = !goal.isEveryday && data.isEveryday;
        const isDeleteEverydayGoal = goal.isEveryday && !data.isEveryday && goal.everydayGoalRef;

        if (isAddEverydayGoal) {
            const everydayGoalId = uuid();
            addEverydayGoal({
                state,
                payload: data,
                everydayGoalId
            })
            goals[index] = {...data, everydayGoalRef: everydayGoalId, finished, logs, id};

        } else if (isDeleteEverydayGoal) {
            deleteEverydayGoal({ state, everydayGoalRef: goal.everydayGoalRef! });
            goals[index] = {...data, finished, logs, id};
        } else if (isUpdateEverydayGoal) {
            addEverydayGoal({
                state,
                payload: data,
                everydayGoalId: goal.everydayGoalRef!
            })
            goals[index] = {...goals[index], ...data, finished, logs, id};
        } else {
            goals[index] = {...data, finished, logs, id};
        }

        const { sortedGoals, newIndex } = getSortedGoals(goals, id);
        state.selectedGoal = {...state.selectedGoal!, ...goals[index], index: newIndex};
        state.todayGoals[date] = sortedGoals;
        state.todayGoals = { ...state.todayGoals };
        saveTodayGoals(state.todayGoals);
      } else {
        state.goals[index] = {...data, finished, logs, id};
        const { sortedGoals, newIndex } = getSortedGoals(state.goals, id);
        state.selectedGoal = {...state.selectedGoal!, ...data, index: newIndex};
        state.goals = sortedGoals as Goal[];
        saveGoals(state.goals);
      }
    },
    updateGoals(state, { payload }: PayloadAction<Goal[]>) {
        if (state.goalType === GoalType.Today) {
            const today = moment().format('YYYY-MM-DD');
            state.todayGoals[today] = payload;
            state.todayGoals = {...state.todayGoals};
            saveTodayGoals(state.todayGoals);
        } else {
            state.goals = [...payload];
            saveGoals(state.goals);
        }
    },
    updateFinished(state, { payload: { index, changedValue, duration = '', type, logIndex = 0 } }: PayloadAction<{index: number, changedValue: number, type: UpdateFinishedType, duration?: string, logIndex?: number}>) {
        let { finished, logs, date } = state.selectedGoal!;
        const currentGoal = state.goalType === GoalType.Today ? state.todayGoals[date][index] : state.goals[index];
        let deletedLog = {};
        const timestamp = moment().format("YYYY-MM-DD HH:mm:ss");

        if (type === UpdateFinishedType.Decrease) {
            deletedLog = currentGoal.logs[logIndex];
            finished = finished - changedValue;
            currentGoal.logs.splice(logIndex, 1);
        } else {
            finished = finished + changedValue;

            currentGoal.logs.unshift({
                duration,
                timestamp,
                increasedValue: changedValue
              })

              state.executingGoal = {
                ...defaultExecutingGoal
              };

              removeExecutingGoal();
        }
        if (finished <= 0) {
            finished = 0;
        }

        if (state.goalType === GoalType.Today) {
            const todayGoals = (state.todayGoals[date] as Goal[]);
            todayGoals[index].finished = finished;
            const { sortedGoals, newIndex } = getSortedGoals(state.todayGoals[date], todayGoals[index].id);
            state.selectedGoal = {...state.todayGoals[date][index], index: newIndex, date: state.selectedGoal!.date }
            state.todayGoals[date] = sortedGoals;
            state.todayGoals = {...state.todayGoals};
            saveTodayGoals(state.todayGoals);

            const parentGoal = state.goals.find(goal => goal.id ===  state.selectedGoal?.parentId);
            if (parentGoal) {
                if (type === UpdateFinishedType.Decrease) {
                    const parentLogIndex = parentGoal.logs.findIndex(log => log.timestamp === (deletedLog as any).timestamp); 
                    if (parentLogIndex !== -1) {
                        parentGoal.finished -= changedValue;
                        parentGoal.logs.splice(parentLogIndex, 1);
                    }
                } else {
                    parentGoal.finished += changedValue;
                    parentGoal.logs.unshift({
                        duration,
                        timestamp,
                        increasedValue: changedValue
                    });
                }

                const { sortedGoals } = getSortedGoals(state.goals, parentGoal.id);
                state.goals = sortedGoals;
            }
        } else {
            state.goals[index].finished = finished;
            const { sortedGoals, newIndex } = getSortedGoals(state.goals, state.goals[index].id);
            state.selectedGoal = {...state.goals[index], index: newIndex, date: state.selectedGoal!.date }
            state.goals = sortedGoals;
            saveGoals(state.goals);
        }
    },
    deleteGoal(state, { payload }: PayloadAction<number>) {
        if (state.goalType === GoalType.Today) {
            const { date, id, everydayGoalRef } = state.selectedGoal!;
            if (everydayGoalRef) {
                deleteEverydayGoal({
                    state,
                    everydayGoalRef
                })
            }
            state.todayGoals[date] = state.todayGoals[date].filter(i => i.id !== id);
            state.todayGoals = {...state.todayGoals};
            saveTodayGoals(state.todayGoals );
        } else {
            state.goals.splice(payload, 1);
            state.goals = [...state.goals];
            saveGoals(state.goals);
        }
    },
    updateSelectedGoal(state, { payload }: PayloadAction<Goal & { index: number, date: string } | null>) {
        state.selectedGoal = payload;
    },
    updateIsEdit(state, { payload }: PayloadAction<boolean>) {
        state.isEdit = payload;
    },
    initExecutingGoal(state, { payload }: PayloadAction<ExecutingGoal>) {
        state.executingGoal = payload;
    },
    startExecutingGoal(state ) {
        state.executingGoal = {
            ...defaultExecutingGoal,
            selectedGoal: state.selectedGoal,
            isExecuting: true,
            isPaused: false,
            startTimestamp: moment().valueOf(),
            finishedTimeSlice: state.executingGoal.finishedTimeSlice
        }

        saveExecutingGoal(state.executingGoal);
    },
    pauseExecutingGoal(state) {
        const currentTimestamp = moment().valueOf();
        const newFinishedTimeSlice = currentTimestamp -  state.executingGoal.startTimestamp + state.executingGoal.finishedTimeSlice;

        state.executingGoal = {
            ... state.executingGoal,
            isExecuting: true,
            isPaused: true,
            startTimestamp: moment().valueOf(),
            finishedTimeSlice: newFinishedTimeSlice
        }

        saveExecutingGoal(state.executingGoal);
    },
    finishUnitHourExecutingGoal(state, {payload}: PayloadAction<{ duration: string }>) {
        const currentTimestamp = moment().valueOf();
        const { startTimestamp, finishedTimeSlice, selectedGoal } = state.executingGoal;
        const totalHour = moment.duration(finishedTimeSlice, 'milliseconds').asHours();

        const index = selectedGoal!.index;
        const finished = selectedGoal!.finished + totalHour;

        const currentGoals = state.goalType === GoalType.Today ? state.todayGoals[selectedGoal!.date] : state.goals;

        const newLog = {
            duration: payload.duration,
            timestamp: moment().format("YYYY-MM-DD HH:mm:ss"),
            increasedValue: totalHour
        };
        currentGoals[index].finished = finished;
        currentGoals[index].logs.unshift(newLog)

        const { sortedGoals, newIndex } = getSortedGoals(currentGoals, selectedGoal!.id);
        state.selectedGoal = {...currentGoals[index], index: newIndex, date: state.selectedGoal!.date };

        if (state.goalType === GoalType.Today) {
            state.todayGoals[selectedGoal!.date] = sortedGoals;
            saveTodayGoals(state.todayGoals);
            const parentGoal = state.goals.find(goal => goal.id ===  state.executingGoal.selectedGoal?.parentId);
            if (parentGoal) {
                parentGoal.finished += totalHour;
                parentGoal.logs.unshift(newLog);
                const { sortedGoals } = getSortedGoals(state.goals, parentGoal.id);
                state.goals = sortedGoals;
            }
        } else {
            state.goals = sortedGoals;
        }
        saveGoals(state.goals);
        
        state.executingGoal = {
            ...defaultExecutingGoal,
            selectedGoal: state.selectedGoal
        };

        removeExecutingGoal();
    },
    resetExecutingGoal(state) {
        state.executingGoal = defaultExecutingGoal;
        removeExecutingGoal();
    },
    updateEncourageConfig(state, { payload }: PayloadAction<EncourageConfig>) {
        state.encourageConfig = payload;

        saveEncourageConfig(payload);
    },
    updateAnime(state, { payload }) {
        state.anime = payload;

        if (!state.encourageConfig.selectedHero) {
            state.encourageConfig.selectedHero = payload.heros[0];
        }

        if (!state.encourageConfig.selectedPrincess) {
            state.encourageConfig.selectedPrincess = payload.princess[0];
        }
    }
  },
});

// 导出actions
export const {
    addGoal,
    updateGoal,
    deleteGoal,
    initGoals,
    initEverydayGoals,
    updateSelectedGoal,
    updateIsEdit,
    updateFinished,
    startExecutingGoal,
    pauseExecutingGoal,
    finishUnitHourExecutingGoal,
    resetExecutingGoal,
    initExecutingGoal,
    updateEncourageConfig,
    updateGoals,
    initTodayGoals,
    updateGoalType,
    updateAnime,
} = goals.actions;

// 导出reducer，在创建store时使用到
export default goals.reducer;
