export enum Animal {
    Cat = 'cat',
    Bunny = 'bunny',
    Penguin = 'penguin',
    Chicken = 'chicken',
    Ghost = 'ghost',
    Others = 'others',
  }
  
export  const animalList = [
    {
      name: '可爱猫',
      type: Animal.Cat
    },
    {
      name: '迷你兔',
      type: Animal.Bunny
    },
    {
      name: '学习鸡',
      type: Animal.Chicken
    },
    {
      name: '爱心企鹅',
      type: Animal.Penguin
    },
    {
      name: '开心幽灵',
      type: Animal.Ghost
    },
    {
      name: '其它',
      type: Animal.Others
    },
  ]
  
export  const animalTotal = {
    [Animal.Cat]: 22,
    [Animal.Bunny]: 21,
    [Animal.Chicken]: 17,
    [Animal.Penguin]: 25,
    [Animal.Ghost]: 10,
    [Animal.Others]: 9,
}