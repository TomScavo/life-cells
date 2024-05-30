import moment from "moment";
import { createSlice,PayloadAction } from "@reduxjs/toolkit";
import Taro from "@tarojs/taro";

import {
    Goal,
    GoalType,
    State,
    ExecutingGoal,
    EncourageConfig,
    EverydayGoals,
} from '../../types/goals'

import { uuid } from '../../../utils'

import { Store } from '../../../constants';

export * from "./addTodayGoal";
export * from "./addEverydayGoal";
export * from "./deleteEverydayGoal";

export function saveGoals(goals: Goal[]) {
    Taro.setStorage({
        key: Store.Goals,
        data: JSON.stringify(goals)
    });
}

export function saveGoalType(goalType: GoalType) {
    Taro.setStorage({
        key: Store.GoalType,
        data: goalType
    });
}

export function saveTodayGoals(todayGoal: State['todayGoals']) {
    Taro.setStorage({
        key: Store.TodayGoals,
        data: JSON.stringify(todayGoal)
    });
}

export function saveExecutingGoal(executingGoal: ExecutingGoal) {
    Taro.setStorage({
        key: Store.ExecutingGoal,
        data: JSON.stringify(executingGoal)
    });
}

export function saveEncourageConfig(encourageConfig: EncourageConfig) {
    Taro.setStorage({
        key: Store.EncourageConfig,
        data: JSON.stringify(encourageConfig)
    });
}

export function removeExecutingGoal() {
    Taro.setStorage({
        key: Store.ExecutingGoal,
        data: ''
    });
}

export function saveEverydayGoals(goals: EverydayGoals) {
    Taro.setStorage({
        key: Store.EverydayGoals,
        data: JSON.stringify(goals)
    });
}

export function findEverydayGoal(everydayGoalRef: string) {
   const everydayGoals = JSON.parse(Taro.getStorageSync(Store.EverydayGoals) || '{}') as EverydayGoals;
   return everydayGoals[everydayGoalRef];
}

export function getSortedGoals(goals: Goal[], id: string) {
    const finishedGoals = goals.filter(goal => (
        goal.finished >= goal.total
    ))
    const unfinishedGoals = goals.filter(goal => (
        goal.finished < goal.total
    ))

    const sortedGoals = [...unfinishedGoals, ...finishedGoals];
    const newIndex = sortedGoals.findIndex(i => i.id === id);

    return {sortedGoals, newIndex };
}
