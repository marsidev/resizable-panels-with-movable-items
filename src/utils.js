export const swapArrayItems = (array, fromIndex, toIndex) => {
  if (toIndex >= array.length)
    toIndex = array.length - 1

  if (fromIndex === toIndex)
    return array

  const newArray = [...array]
  const target = newArray[fromIndex]

  newArray.splice(fromIndex, 1)
  newArray.splice(toIndex, 0, target)

  return newArray
}
