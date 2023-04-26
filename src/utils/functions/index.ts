export function getCurrentDate() {
  const date = new Date()
  const day = date.getDate()
  const month = date.getMonth() + 1
  const year = date.getFullYear()
  return `${year}-${month}-${day}`
}
export function getCookie(name: string) {
  const arr = document.cookie.match(new RegExp(`(^| )${name}=([^;]*)(;|$)`))
  if (arr != null)
    return decodeURIComponent(arr[2])

  else
    return null
}
export function setCookie(name: string, value: string, hours: number) {
  let expires = ''
  if (hours) {
    const date = new Date()
    date.setTime(date.getTime() + hours * 60 * 60 * 1000)
    expires = `; expires=${date.toUTCString()}`
  }
  document.cookie = `${name}=${value}${expires}; path=/`
}
export function delCookie(name: string) {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`
}
