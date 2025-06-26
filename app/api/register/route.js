import pool from '@/app/lib/db'
import bcrypt from 'bcrypt'

const USERNAME_REGEX = /^[A-Za-z0-9_]{3,20}$/
const PASSWORD_REGEX = /^[A-Za-z0-9]{8,}$/

export async function POST(request) {
  const { username: rawU, password: rawP } = await request.json()

  const username = rawU?.trim()
  const password = rawP?.trim()

  if (!USERNAME_REGEX.test(username)) {
    return new Response(JSON.stringify({ error: "Username must be 3-20 char and only numbers and letters!"}), {
        status: 400,
        headers: {"Content-Type": "application/json"},
    })
  }
  if (!PASSWORD_REGEX.test(password)) {
    return new Response(JSON.stringify({ error: "Password must be ≥8 chars, letters & numbers only."}), {
        status: 400,
        headers: {"Content-Type": "application/json"},
    })
  }

  const result = await pool.query(
    'SELECT 1 FROM users WHERE username = $1',
    [username]
  )
  if (result.rowCount) {
    return new Response(JSON.stringify({ error: "Username already taken"}), {
        status: 409,
        headers: {"Content-Type": "application/json"},
    })
  }

  const hash = await bcrypt.hash(password, 10)
  await pool.query(
    'INSERT INTO users(username, password_hash) VALUES($1, $2)',
    [username, hash]
  )

  return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: {"Content-Type": "application/json"},
    })
}
