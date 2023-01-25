export default interface SnapshotRepositoryInterface {
  getSpaces: () => Promise<Record<string, any>>
  getGhOrgsBySpaceIds: (ids: string[]) => Promise<string[]>
  getVoters: (
    ids: string[],
    { since, until }: { since?: Date; until?: Date },
  ) => Promise<string[]>
}
