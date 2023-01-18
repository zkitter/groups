export const minusOneMonth = (date: Date) =>
  new Date(new Date().setMonth(date.getMonth() - 1))

export const getTime = (date: Date) => Math.floor(date.getTime() / 1000)
