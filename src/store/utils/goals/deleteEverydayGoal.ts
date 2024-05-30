import { saveEverydayGoals } from './';

import { State } from '../../types/goals'

interface Args {
    state: State;
    everydayGoalRef: string;
}

export function deleteEverydayGoal({
    state,
    everydayGoalRef
}: Args) {
    if (!state.everydayGoals[everydayGoalRef]) return;

    const everydayGoals = state.everydayGoals;

    delete everydayGoals[everydayGoalRef];
    state.everydayGoals = {...everydayGoals};
    saveEverydayGoals(everydayGoals);
}
