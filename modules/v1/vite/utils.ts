import fs from 'node:fs'
import path from 'node:path'
import type { Plugin } from 'vite'
import { manifest, pkg } from './constants'

export function dir(...paths: string[]) {
  return path.resolve(__dirname, '../', ...paths)
}

export function getOutDir() {
  return dir(`release/text-picker@${pkg.version}`)
}

export function chromeManifestPlugin(): Plugin {
  return {
    name: 'chrome-manifest-plugin',
    async closeBundle() {
      const json = {
        ...manifest,
        description: pkg.description,
        version: pkg.version,
      }

      fs.writeFileSync(
        path.join(getOutDir(), 'manifest.json'),
        JSON.stringify(json, null, 4),
      )
    },
  }
}
