import * as React from "react";
import {getVariants, IVariant} from "./variants";

function onlyUnique(value: any, index: number, self: any[]) {
  return self.indexOf(value) === index;
}

export function useVariants() {
  const [variants, setVariants] = React.useState<Array<IVariant>>([])
  const variantParticipants: Array<number> = variants.map(({variantParticipants}) => parseInt(variantParticipants, 10)).filter(onlyUnique)
  const variantWays: Array<number> = variants.map(({variantWay}) => parseInt(variantWay, 10)).filter(onlyUnique)
  console.log(`Variants found`, variantParticipants, variantWays)
  const [selectedNumberOfParticipants, setSelectedNumberOfParticipants] = React.useState(Math.max(...variantParticipants))
  const [selectedVariant, setSelectedVariant] = React.useState('1')
  const moveToVariant = (participants: string, way: string) => {
    const variant = variants.find(({variantParticipants, variantWay}) => (
      variantParticipants === participants &&
      variantWay === way
    ))
    if (!variant) {
      console.error(`No variant found for participants "${selectedNumberOfParticipants}" and variant "${selectedVariant}"`)
      return
    }
    console.log(`Move to variant ${variant.frame.title}`, selectedNumberOfParticipants, selectedVariant)
    miro.board.viewport.zoomTo(variant.frame)
  }
  const handleSelectedNumberOfParticipants = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const participants = parseInt(event.target.value, 10);
    setSelectedNumberOfParticipants(participants)
    moveToVariant(event.target.value, selectedVariant)
  }
  const handleSelectVariant = (variantId: string) => {
    setSelectedVariant(variantId)
    moveToVariant(selectedNumberOfParticipants.toString(), variantId)
  }

  React.useEffect(() => {
    getVariants().then(asyncVariants => {
      console.log('Variants found', asyncVariants)
      setVariants(asyncVariants)
    })
  }, [])

  return {
    variantParticipants,
    selectedNumberOfParticipants,
    handleSelectedNumberOfParticipants,
    selectedVariant,
    handleSelectVariant
  };
}