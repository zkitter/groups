async function jsonParser<T = unknown>(response: Response): Promise<T> {
  return response.json()
}

export default jsonParser
