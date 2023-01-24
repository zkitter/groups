export class GqlRepository {
  headers: HeadersInit = { 'Content-Type': 'application/json' }

  constructor(readonly gqlEndpoint: string, token?: string) {
    if (token !== undefined) this.headers = { Authorization: `Bearer ${token}` }
  }

  async gqlQuery(
    query: string,
    variables?: Record<string, unknown>,
  ): Promise<Record<string, any>> {
    const body: Record<string, unknown> = { query }
    if (variables !== undefined) body.variables = variables

    const res = await fetch(this.gqlEndpoint, {
      body: JSON.stringify({
        query,
        variables,
      }),
      headers: this.headers,
      method: 'POST',
    })

    return res.json()
  }
}
