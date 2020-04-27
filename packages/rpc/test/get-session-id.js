export default function getSessionId(resp) {
  let sessionId
  if (!resp.data.result.session_id) {
    let cookieHeader = resp.headers['set-cookie'][0]
    let start = cookieHeader.indexOf('=')
    let end = cookieHeader.indexOf(';')
    sessionId = cookieHeader.substring(start + 1, end)
  } else {
    sessionId = resp.data.result.session_id
  }

  return sessionId
}