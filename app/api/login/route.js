import pool from '@/app/lib/db'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { serialize } from 'cookie'

const USERNAME_REGEX = /^[A-Za-z0-9_]{3,20}$/
const PASSWORD_REGEX = /^[A-Za-z0-9]{8,}$/

export async function POST(request) {
  const { username: rawU, password: rawP } = await request.json()
  const username = rawU?.trim()
  const password = rawP?.trim()

  if (!USERNAME_REGEX.test(username)) {
    return new Response(
      JSON.stringify({
        error: 'Username must be 3–20 chars: letters, numbers & underscores only',
      }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
  if (!PASSWORD_REGEX.test(password)) {
    return new Response(
      JSON.stringify({
        error: 'Password must be at least 8 chars, letters & numbers only',
      }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }

  const result = await pool.query(
    'SELECT id, password_hash FROM users WHERE username = $1',
    [username]
  )
  if (result.rowCount === 0) {
    return new Response(
      JSON.stringify({ error: 'Invalid username or password' }),
      {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }

  const { id, password_hash } = result.rows[0]
  const passwordMatches = await bcrypt.compare(password, password_hash)
  if (!passwordMatches) {
    return new Response(
      JSON.stringify({ error: 'Invalid username or password' }),
      {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }

const token = jwt.sign(
  { userId: id, username },
  process.env.JWT_SECRET,
  { expiresIn: '7d' }
)
  const cookie = serialize('token', token, {
    httpOnly: true,
    path: '/',
    maxAge: 7 * 24 * 60 * 60,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  })

  return new Response(
    JSON.stringify({ success: true, userId: id }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': cookie,
      },
    }
  )
}