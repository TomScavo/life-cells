import moment from "moment";
import pick from 'lodash-es/pick';
import omit from 'lodash-es/omit';

import {
    State,
    Goal,
} from '../../types/goals'

import {
    saveEverydayGoals
} from './'

interface Args {
    state: State;
    payload: Omit<Goal, 'finished' | 'logs' | 'id' | 'everydayGoalRef'>;
    everydayGoalId: string
}

export function addEverydayGoal({
    state,
    payload,
    everydayGoalId
}: Args) {
    const everydayGoals = {
        ...state.everydayGoals,
        [everydayGoalId]: {
            ...omit(payload, 'isEveryday', 'parentId')
        },
    };
    state.everydayGoals = everydayGoals;
    saveEverydayGoals(everydayGoals);
}
