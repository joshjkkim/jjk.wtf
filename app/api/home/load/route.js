import pool from '@/app/lib/db'
import jwt from 'jsonwebtoken'
import { parse } from 'cookie'

export async function GET(request) {
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

    const { rows } = await pool.query(
      `SELECT home
         FROM users
        WHERE id = $1`,
      [payload.userId]
    )
    if (!rows.length) {
      return new Response(JSON.stringify({ error: 'No save found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const { home } = rows[0]
    return new Response(
      JSON.stringify({ home }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  } catch (err) {
    console.error(err)
    return new Response(JSON.stringify({ error: 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
