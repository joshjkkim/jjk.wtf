import jwt from 'jsonwebtoken'

export async function GET(request) {
  const cookieHeader = request.headers.get('cookie') || ''
  const token = cookieHeader
    .split(';')
    .map(c => c.trim())
    .find(c => c.startsWith('token='))
    ?.split('=')[1]

  if (!token) {
    return new Response(
      JSON.stringify({ authenticated: false, error: "User has no token" }),
      {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    return new Response(
      JSON.stringify({
        authenticated: true,
        userId:   payload.userId,
        username: payload.username,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  } catch (err) {
    return new Response(
      JSON.stringify({ authenticated: false, error: "User not authenticated" }),
      {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}