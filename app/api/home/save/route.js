import pool from '@/app/lib/db'
import jwt from 'jsonwebtoken'
import { parse } from 'cookie'

export async function POST(request) {
  try {
    const cookieHeader = request.headers.get('cookie') || ''
    const { token } = parse(cookieHeader)
    if (!token) {
      return new Response(JSON.stringify({ error: 'Not authenticated' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      })
    }
    let payload
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET)
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    let { placedItems } = await request.json()

    await pool.query(
      `UPDATE users
         SET home   = $1::jsonb
       WHERE id = $2`,
      [
        JSON.stringify(placedItems),
        payload.userId,
      ]
    )

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error(err)
    return new Response(JSON.stringify({ error: 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
