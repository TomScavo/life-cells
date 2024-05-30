import moment from 'moment';
import { Goal, TodayGoals } from "../../store/types/goals";

export function convertToNumber(val: string) {
    let num: any = val.toString(); //先转换成字符串类型
    if (num.indexOf('.') == 0) { //第一位就是 .
        num = '1' + num
    }
    num = num.replace(/[^\d.]/g, ""); //清除“数字”和“.”以外的字符
    num = num.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的
    num = num.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
    num = num.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); //只能输入两个小数
    if (num.indexOf(".") < 0 && num != "") {
        num = parseFloat(num);
    }
    return Number(num);
}

// export function changeImageFormat(url: string) {
//     const format = ['jpeg', 'png', 'gif', 'jpg'];
//     const urlArr = url.split('.');
//     const currentFormat = urlArr.pop();
//     if (!currentFormat) return;
//     const nextFormatIndex = format.indexOf(currentFormat) + 1;
//     if (nextFormatIndex >= format.length) return;
//     const nextFormat = format[nextFormatIndex];

//     return (urlArr.join('.') + '.' + nextFormat);
// }
  

export function getErrorMsg(
  {formValues, goals, isEdit, selectedGoal, isTodayGoal, todayGoals }:
  {formValues: any, goals: Goal[], todayGoals: TodayGoals, isEdit: boolean, selectedGoal: any, isTodayGoal: boolean}
) {
    const { goal, task, total, unit, selectedImageUrl } = formValues;
    goals = isTodayGoal ? todayGoals[moment().format('YYYY-MM-DD')] || [] : goals
    let errorMsg = '';
    if (!goal) {
      errorMsg = '请填写目标';
      return errorMsg;
    }

    if(goals.some((({goal: goalName}, index) => {
       if (isEdit && index === selectedGoal.index) return false; 
       return goalName === goal;
    }))) {
      errorMsg = '目标已存在';
      return errorMsg;
    }

    if (!task) {
      errorMsg = '请填写需要做的事项';
      return errorMsg;
    }

    if (!total || !parseFloat(total)) {
      errorMsg = '请填写总量';
      return errorMsg;
    }

    if (!unit) {
      errorMsg = '请填写单位';
      return errorMsg;
    }

    if (!selectedImageUrl) {
      errorMsg = '请选择一张封面图片';
      return errorMsg;
    }

    return errorMsg;
}
