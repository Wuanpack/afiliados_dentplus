export const parseRouteId = (param: string | string[] | undefined): number | null => {
  const id = parseInt(String(param), 10)
  return Number.isNaN(id) ? null : id
}
