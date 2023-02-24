# Zkitter Groups

Top snapshot organizations as per their number of followers are whitelisted and result in 2 groups:

- the GitHub users who contributed to one of the public repository of one of the whitelisted organization
- the ethereum addresses who participated in of the snapshot vote of one of the whitelisted organization

## API

| METHOD | PATH                                 | DESCRIPTION                                                                     | RESPONSE                                                                                                                                          |
| ------ | ------------------------------------ | ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| GET    | `/whitelist?format=short\|long`      | Get list of whitelisted organizations in `short` or `long` format               | `Array<{ followers: number, followers7d?: number, snapshotId: string, snapshotName: string, ghName: string, repos: string[], voters: string[] }>` |
| GET    | `/whitelist/refresh`                 | Update list of whitelisted orgs and their repos. Return updated whitelist       | `Array<{ followers: number, followers7d?: number, snapshotId: string, snapshotName: string, ghName: string, repos: string[] }>`                   |
| GET    | `/user/:username?format=short\|long` | Get user `username` in `short` (only groups info) or `long` (with repos) format | `{ belongsToGhContributorsGroup: boolean, belongsToDaoVotersGroups: boolean }`                                                                    |
| GET    | `/user/:username/refresh`            | Update list of repos the user `username` contributed to and return updated user | `{ ghName: string, repos: string[]}`                                                                                                              |
