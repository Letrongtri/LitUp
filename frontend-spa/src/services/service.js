/**
 * @param {string} url
 * @param {RequestInit} options
 * @returns Promise<Response>
 */
export async function efetch(url, options = {}) {
  let result = {}
  let json = {}

  try {
    result = await fetch(url, options)
    json = await result.json()
  } catch (error) {
    throw new Error(error.message)
  }

  if (!result.ok || json.status !== 'success') {
    throw new Error(json.message)
  }
  return json.data
}

// export default { efetch }
