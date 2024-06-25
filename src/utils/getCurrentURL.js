export default function getCurrentURL() {
  const currentURL = window.location.href
  const domainCH = currentURL.includes('.ch')

  return domainCH
}
