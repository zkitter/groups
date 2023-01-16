# GH Groups

Get list of GH users who contributed to the GitHub org of a given group of DAOs.  
Under the hood, it:

1. Fetches a list of `maxOrgs` (default 100) spaces from snapshot.org based on their `minFollowers` (default 10_000).
2. For each space, it fetches the list of their repositories on GitHub.
3. For each of the org repository, it fetches the list of contributors between a `since` and `until`timestamps (default between now and now - 1 month).
4. Returns the list of unique contributors, removing potential bots (e.g dependencies, github action bots etc...)

## Usage

You need to have a GH Personal Access Token (scopes: `public_repo`, `read:user`) defined as environment variables.

### Scripts

- fetch spaces: `nps 'fetch.spaces -m <min followers amount> -s <group size>`
- fetch group of gh users: `nps fetch.ghgroup`

### Node

```
import { getGhGroup } from './src'

const group = await getGhGroup()
```
