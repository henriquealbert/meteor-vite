import fs from 'node:fs/promises'
import { createServer } from 'vite'
import Path from 'path';

import { MeteorStubs } from 'meteor-vite/plugin';

process.on('message', async message => {
  if (message === 'start') {
    // Start server
    const server = await createServer({
      plugins: [
        MeteorStubs({
          meteorPackagePath: Path.join('.meteor', 'local', 'build', 'programs', 'web.browser', 'packages'),
          projectJsonContent: JSON.parse(await fs.readFile('package.json', 'utf-8')),
        }),
        {
          name: 'meteor-handle-restart',
          buildStart () {
            if (listening) {
              sendViteSetup()
            }
          },
        },
      ],
    })
    
    let listening = false
    await server.listen()
    sendViteSetup()
    listening = true
    
    function sendViteSetup () {
      process.send({
        kind: 'viteSetup',
        data: {
          host: server.config.server?.host,
          port: server.config.server?.port,
          entryFile: server.config.meteor?.clientEntry,
        },
      })
    }
  }
})
