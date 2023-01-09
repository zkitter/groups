# GH Groups
Get list of GH users who contributed to the GitHub org of a given group of DAOs.

## Usage
- script: `nps 'fetch -m <min followers amount> -s <group size>`
- node
   ```
   import { getSpaces} from './src/getSpaces'
  
  const spaces = await getSpaces({min, size})()
  ```