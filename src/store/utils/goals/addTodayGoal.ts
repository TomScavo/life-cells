import moment from "moment";
import pick from 'lodash-es/pick';
import omit from 'lodash-es/omit';

import { uuid } from '../../../utils'

import {
    State,
    Goal,
} from '../../types/goals'

import {
    saveTodayGoals,
    addEverydayGoal
} from './'

interface Args {
    state: State;
    payload: Omit<Goal, 'finished' | 'logs' | 'id' | 'everydayGoalRef'>;
    defaultValues: { id: string, finished: number, logs: any[] }
}

export function addTodayGoal({
    state,
    payload,
    defaultValues
}: Args) {
    const today = moment().format('YYYY-MM-DD');
    let todayGoals = state.todayGoals[today] || [];

    if (payload.isEveryday) {
        const everydayGoalId = uuid();
        addEverydayGoal({
            state,
            payload,
            everydayGoalId
        })
        todayGoals = [{everydayGoalRef: everydayGoalId, ...payload, ...defaultValues}, ...todayGoals]

    } else {
        todayGoals = [{...payload, ...defaultValues}, ...todayGoals];
    }

    state.todayGoals[today] = todayGoals;
    state.todayGoals = {...state.todayGoals};
    saveTodayGoals(state.todayGoals);
}
