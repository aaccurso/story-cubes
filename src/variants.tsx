import * as React from 'react'
import variant1 from './assets/variant1.jpg'
import variant2 from './assets/variant2.jpg'
import variant3 from './assets/variant3.jpg'
import {Frame} from "@mirohq/websdk-types";

const VARIANT_REGEX = /Playground colour way (\d) - (\d)p/

export interface IVariant {
  frame: Frame
  variantWay: string
  variantParticipants: string
}

export const getVariants = async (): Promise<Array<IVariant>> => {
  const frames = await miro.board.get({type: 'frame'})
  const variants = []

  for (let i = 0; i < frames.length; i++) {
    const frame = frames[i]
    if (!VARIANT_REGEX.test(frame.title)) {
      continue
    }
    const matchArray = frame.title.match(VARIANT_REGEX)
    if (!matchArray) {
      continue
    }
    const [, variantWay, variantParticipants] = matchArray
    const variant = {
      frame,
      variantWay,
      variantParticipants,
    }
    variants.push(variant)
  }
  return variants
}

const variantList = [
  {
    id: '1',
    link: 'https://miro.com/app/board/uXjVO9Ww1Cs=/?moveToWidget=3458764523193177930&cot=14',
    image: variant1
  },
  {
    id: '2',
    link: 'https://miro.com/app/board/uXjVO9Ww1Cs=/?moveToWidget=3458764523198985335&cot=14',
    image: variant2
  },
  {
    id: '3',
    link: 'https://miro.com/app/board/uXjVO9Ww1Cs=/?moveToWidget=3458764523200883319&cot=14',
    image: variant3
  }
]

interface IProps {
  selectedVariant: string
  onSelectVariant: (variantId: string) => void
}

export const Variants: React.FC<IProps> = ({selectedVariant, onSelectVariant}) => {
  return (
    <div>
      <p>
        2. Choose a template you like:
      </p>
      <div className="carousel">
        {variantList.map(({id, image}) => (
          <div
            key={id}
            onClick={() => onSelectVariant(id)}
            className={`carousel_item ${selectedVariant === id ? 'carousel_item-selected' : ''}`}
          >
            <img src={image} alt=""/>
          </div>
        ))}
      </div>
    </div>
  )
}
