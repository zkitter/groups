import { getCommittersGroup } from 'gh/get-committers-group'
import { Handler } from './Handler'

const committersGroupHandler = Handler(getCommittersGroup)
export default committersGroupHandler
