import { headers } from 'next/headers'

export async function getUser() {
    try {
        
  const h = await headers()
   console.log("x-user-id:", h.get("x-user-id"));
  console.log("x-user-email:", h.get("x-user-email"));
  console.log("x-user-role:", h.get("x-user-role"));

  return {
    _id:   h.get('x-user-id')    ?? undefined,
    email: h.get('x-user-email') ?? undefined,
    role:  h.get('x-user-role')  ?? undefined,
  }
  }catch (err) {
    console.error("Error in getUser:", err)
    return {
      _id: undefined,
      email: undefined,
      role: undefined
    }
  }
}