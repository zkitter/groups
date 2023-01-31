import { Request, Response } from 'express'
import { Service } from 'typedi'

const html = `
  <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Zkitter Groups API</title>
  </head>
  <body>
    <div>
      <h1>ZKITTER GROUPS API</h1>
      <h2>Routes</h2>
      <table>
        <tr>
          <th>Method</th>
          <th>Path</th>
          <th>Response</th>
        </tr>
        <tr>
          <td>GET</td>
          <td>/whitelist?format=long|short</td>
          <td>Get list of whitelisted organizations in <code>short</code> or <code>long</code> format</td>
        </tr>
        <tr>
          <td>GET</td>
          <td>/whitelist/refresh</td>
          <td>Update list of whitelisted orgs and their repos. Return updated whitelist</td>
        </tr>
        <tr>
          <td>GET</td>
          <td>/user/:username</td>
          <td>Get user <code>username</code> in <code>short</code> (only groups info) or <code>long</code> (with repos) format</td>
        </tr>
        <tr>
          <td>GET</td>
          <td>/user/:username/refresh</td>
          <td>Update list of repos the user <code>username</code> contributed to and return updated user</td>
        </tr>
      </table>
    </div>
    <hr>
    <footer>
      <a
        rel="stylesheet"
        target="_blank"
        href="https://github.com/zkitter/groups"
        >https://github.com/zkitter/groups</a
      >
    </footer>
  </body>
</html>
`

@Service()
export class HomeController {
  async home(_: Request, res: Response) {
    res.send(html)
  }
}
