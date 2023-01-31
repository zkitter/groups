# GH Groups

Get list of GH users who contributed to the GitHub org of a given group of DAOs.  
Under the hood, it:

1. Fetches a list of `maxOrgs` (default 100) spaces from snapshot.org based on their `minFollowers` (default 10_000).
2. For each space, it fetches the list of their repositories on GitHub.
3. For each of the org repository, it fetches the list of contributors between a `since` and `until`timestamps (default between now and now - 1 month).
4. Returns the list of unique contributors, removing potential bots (e.g dependencies, github action bots etc...)

## API

| METHOD | PATH                                 | DESCRIPTION                                                                     | RESPONSE                                                                                                                        |
| ------ | ------------------------------------ | ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| GET    | `/whitelist?format=short\|long`      | Get list of whitelisted organizations in `short` or `long` format               | `Array<{ followers: number, followers7d?: number, snapshotId: string, snapshotName: string, ghName: string, repos: string[] }>` |
| GET    | `/whitelist/refresh`                 | Update list of whitelisted orgs and their repos. Return updated whitelist       | `Array<{ followers: number, followers7d?: number, snapshotId: string, snapshotName: string, ghName: string, repos: string[] }>` |
| GET    | `/user/:username?format=short\|long` | Get user `username` in `short` (only groups info) or `long` (with repos) format | `{ belongsToGhContributorsGroup: boolean, belongsToDaoVotersGroups: boolean }`                                                  |
| GET    | `/user/:username/refresh`            | Update list of repos the user `username` contributed to and return updated user | `{ ghName: string, repos: string[]}`                                                                                            |
