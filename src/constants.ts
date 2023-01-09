const BASE_URL = 'https://hub.snapshot.org'

export const URLS = {
  EXPLORE: `${BASE_URL}/api/explore`,
  GQL: `${BASE_URL}/graphql`,
}

export const HEADERS = {
  origin: 'https://snapshot.org',
  referer: 'https://snapshot.org/',
  'sec-fetch-dest': 'empty',
  'sec-fetch-mode': 'cors',
  'sec-fetch-site': 'same-site',
  'sec-gpc': '1',
}
