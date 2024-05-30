import moment from 'moment';
import { serverVoicesDir, serverMediaDir } from '../config';
import {  musics } from '../constants';

const millisecondPerYear =  1000 * 60 * 60 * 24 * 365;
const totalTime = millisecondPerYear * 80;
const daysPerMonth = 365 / 12;
const millisecondPerMonth = daysPerMonth * 1000 * 60 * 60 * 24;

function getSpendMillisecond(birthday: string) {
    return moment().valueOf() - moment(birthday).valueOf()
}

export function getSpendTime(birthday: string) {
    const spendTime = moment(getSpendMillisecond(birthday));
  
    return spendTime;
}

export function getSpendMonth(birthday: string) {
    return Math.floor(moment().diff(birthday, 'month', true) * 10) / 10;
}

export function getAge(birthday: string) {
    return Math.floor(moment().diff(birthday, 'year', true) * 10) / 10;
}

export function getAudioSrcFromImageUri(url: string) {
    const voiceUri = url.substring(0, url.lastIndexOf('.'));

    return serverVoicesDir + voiceUri + '.mp3';
}

export function getMusicCoverThumbnail(index: number) {
    return `${serverMediaDir}musics/covers/${index}-thumbnail.jpg`
}

export function getMusicCoverImage(index: number) {
    return `${serverMediaDir}musics/covers/${index}.jpg`
}


export function getRandomBackgroundImage(currentImage?: string): string {
    const musicsLength = musics.length;
    const randomIndex = Math.floor(Math.random() * musicsLength);
    const randomImage = getMusicCoverImage(randomIndex);

    if (randomImage === currentImage) return getRandomBackgroundImage(currentImage);
    return randomImage;
}

export function getAllBackgroundImages() {
    return musics.map((item, i) => getMusicCoverImage(i));
}

export function uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
}

// export function getDecimalNum(total: number) {
//     // 1 秒最大的位置
//     const resultStr = total.toString();
//     const arr = resultStr.split('');
//     const pointIndex = arr.findIndex(i => (i === '.'));
//     if (pointIndex === - 1) return total;

//     const firstNumIndex = arr.findIndex(i => (i !== '0' && i !== '.'));

//     if (arr.includes('e')) {
//         Number(arr.pop());
//         return;
//       }

//     if (firstNumIndex === -1 ) return 0;

//     if (firstNumIndex < pointIndex) {
//         first 
//         return 
//     }


//     setDecimalLength(index - 2 + 1);
//   }