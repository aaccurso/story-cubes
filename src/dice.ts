import {emojis} from './emojis'

type DiceSet = Array<Array<string>>

export const INITIAL_SET: DiceSet = [
  ['๐ฅถ','๐จ','๐ญ','๐','๐','๐'],
  ['๐','๐','๐คถ','๐ฉ','๐ป','๐ฝ'],
  ['๐ฑ','๐ต','๐ฆ','๐ท','๐ถ','๐ฐ'],
  ['๐','๐ฅฅ','๐ฅ','๐','๐','๐'],
  ['๐','๐ผ','๐','๐ก','๐','๐'],
  ['๐','๐','๐','๐ฅ','๐งจ','โจ'],
  ['๐','๐','๐','๐','๐','๐'],
  ['๐','๐ก','๐','โญ','โ','๐ช'],
  ['๐ฅ','๐ช','๐ฌ','๐คบ','๐ท','๐ก'],
]

const getRandomEmoji = () => {
  return emojis[~~(Math.random() * emojis.length)]
}

export const NUMBER_OF_FACES = 6
export const NUMBER_OF_DICE = 9

const RANDOM_EMOJI_DICE_SET: DiceSet = []

for (let i = 0; i < NUMBER_OF_DICE; i++) {
  RANDOM_EMOJI_DICE_SET.push([])
  for (let j = 0; j < NUMBER_OF_FACES; j++) {
    RANDOM_EMOJI_DICE_SET[i][j] = getRandomEmoji()
  }
}

export const randomizeDice = (numberOfDice: number = 1, diceSet: DiceSet = INITIAL_SET): Array<string> => {
  const result = []
  for (let i = 0; i < numberOfDice; i++) {
    const randomFace = Math.floor(Math.random() * NUMBER_OF_FACES)
    result.push(diceSet[i][randomFace])
  }
  return result
}
