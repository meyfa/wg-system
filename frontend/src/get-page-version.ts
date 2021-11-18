/**
 * Determine the 'page version', that is, the chunk identifier of the currently running main chunk.
 * This can then be compared to the value reported by the server to see if the page needs to be
 * reloaded to keep functioning correctly.
 *
 * @returns The page version, or undefined if unable to determine.
 */
export function getPageVersion (): string | undefined {
  if (document.currentScript != null && 'src' in document.currentScript) {
    const match = document.currentScript.src.match(/main\.([0-9a-f]+?)\.chunk\.js/)
    if (match != null && match.length >= 2) {
      return match[1]
    }
    return undefined
  }
}
