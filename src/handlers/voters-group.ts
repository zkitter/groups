import { getVotersGroup } from 'daos/get-voters-group'
import { Handler } from './Handler'

const votersGroupHandler = Handler(getVotersGroup)
export default votersGroupHandler
