import { serverMediaDir } from '../config';

export const musics = [
    {
        name: 'Easy On Me.mp3',
        duration: '5'
    },
    {
        name: 'Before You Go.mp3',
        duration: '4'
    },
    {
        name: 'Thinkin Bout You.mp3',
        duration: '4'
    },
    {
        name: 'If The World Was Ending.mp3',
        duration: '5'
    },
    {
        name: 'Truth Hurts.mp3',
        duration: '3'
    },
    {
        name: 'Roses.mp3',
        duration: '3'
    },
    {
        name: 'I Should Probably Go To Bed.mp3',
        duration: '3'
    },
    {
        name: 'Love Is Gone.mp3',
        duration: '3'
    },
    {
        name: 'Up All Night.mp3',
        duration: '3'
    },
    {
        name: 'Chandelier.mp3',
        duration: '4'
    },
    {
        name: "when the party's over.mp3",
        duration: '3'
    },
    {
        name: 'Heat Waves.mp3',
        duration: '3'
    },
    {
        name: 'Say So.mp3',
        duration: '2'
    },
    {
        name: 'Ride.mp3',
        duration: '3'
    },
    {
        name: 'Astronaut In The Ocean.mp3',
        duration: '2'
    },
    {
        name: "I Ain't Worried.mp3",
        duration: '3'
    },
    {
        name: 'Somebody Else.mp3',
        duration: '4'
    },
    {
        name: 'Riptide.mp3',
        duration: '3'
    },
]

const videos = [
    {
        name: '关于迷茫',
        englishName: 'lost',
        duration: '1'
    },
    {
        name: '关于友善',
        englishName: 'kind',
        duration: '1'
    },
    {
        name: '关于梦想',
        englishName: 'dream',
        duration: '1'
    },
    {
        name: '关于恐惧',
        englishName: 'fear',
        duration: '1'
    },
    {
        name: '关于渺小',
        englishName: 'small',
        duration: '1'
    },
    {
        name: '关于犯错',
        englishName: 'mistake',
        duration: '1'
    },
    {
        name: '关于诚实',
        englishName: 'honesty',
        duration: '1'
    },
    {
        name: '关于帮助',
        englishName: 'help',
        duration: '1'
    },
    {
        name: '关于困难',
        englishName: 'storm',
        duration: '1'
    },
    {
        name: '关于悲观',
        englishName: 'pessimism',
        duration: '1'
    },
    {
        name: '关于自我怀疑',
        englishName: 'self-doubt',
        duration: '1'
    },
    {
        name: '关于目标实现',
        englishName: 'goal-finished',
        duration: '1'
    },
    {
        name: '完整版',
        englishName: 'full-edition',
        duration: '34'
    },
]

export const medias = [
    {
        name: 'piano',
        chineseName: '钢琴曲',
        type: 'music',
        data: musics.map(({name, duration}) => ({
            name,
            duration,
            mediaUrl: serverMediaDir + 'musics/' + name.replaceAll(' ', '-'),
            coverImageUrl: ''
        })),
        
    },
    {
        name: 'the-boy',
        type: 'video',
        chineseName: '男孩、鼹鼠、狐狸和马',
        data: videos.map(({name, duration, englishName}) => ({
            name,
            duration,
            mediaUrl: serverMediaDir + 'videos/' + englishName + '.mp4',
            coverImageUrl: ''
        })),
    }
]

export enum MediaType {
    Piano = 'piano',
    Speech = 'speech',
    Video = 'video'
}