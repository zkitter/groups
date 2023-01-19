import { getCommittersGroup } from 'gh/get-committers-group'
import { Handler } from '../Handler'
import validator from './validations'

const committersGroupHandler = Handler(getCommittersGroup, validator)
export default committersGroupHandler
