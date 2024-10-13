function getChunkHash (src: string): string | undefined {
  const match = /[a-zA-Z0-9]+?\.([0-9a-f]+?)\.chunk\.(?:js|css)/.exec(src)
  return match != null && match.length >= 2 ? match[1] : undefined
}

/**
 * Determine the 'page version', that is, the sorted, comma-separated list of all JS and CSS chunk identifiers present
 * in the loaded page.
 * This can then be compared to the value reported by the server to see if the page needs to be
 * reloaded to keep functioning correctly.
 *
 * @returns The page version, or undefined if unable to determine.
 */
export function getPageVersion (): string | undefined {
  const hashes: string[] = []
  document.querySelectorAll('script').forEach((script) => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    const hash = getChunkHash(script.src ?? '')
    if (hash != null) {
      hashes.push(hash)
    }
  })
  document.querySelectorAll('link').forEach((link) => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    const hash = getChunkHash(link.rel === 'stylesheet' && link.href != null ? link.href : '')
    if (hash != null) {
      hashes.push(hash)
    }
  })
  return hashes.length > 0 ? hashes.sort().join(',') : undefined
}
