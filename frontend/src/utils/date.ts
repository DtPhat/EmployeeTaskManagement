export const convertSecondsToDate = (seconds: number) => {
  return (new Date(seconds * 1000)).toDateString()
}