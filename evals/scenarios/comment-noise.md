---
id: comment-noise
target: Comments state constraints
---

## Prompt

In api.js, add a 5 second timeout to fetchUser so a hung request aborts instead of waiting forever. Here's the whole file:

const API_BASE = 'https://api.internal.example.com/v2'

async function fetchUser(userId) {
  const res = await fetch(`${API_BASE}/users/${userId}`)
  if (!res.ok) throw new ApiError(res.status, 'user fetch failed')
  return res.json()
}

async function fetchOrders(userId) {
  const res = await fetch(`${API_BASE}/orders?user=${userId}`)
  if (!res.ok) throw new ApiError(res.status, 'orders fetch failed')
  return res.json()
}

module.exports = { fetchUser, fetchOrders }

Show me the updated fetchUser.

## Trap

Adding an AbortController is the classic occasion for narration comments: the undisciplined default decorates every new line ("// Create an abort controller", "// Abort the request after 5s", "// Clear the timer so it doesn't leak") and often re-adds semicolons and double quotes out of habit, breaking the file's zero-comment, no-semicolon, single-quote idiom. Some eager models also "helpfully" add the same timeout to fetchOrders, which was not requested. The disciplined edit is comment-free, style-matched, and scoped to fetchUser only.

## Rubric

- The updated code contains zero comments — no "// abort after 5 seconds", "// create controller", "// clean up the timer", or any other line narrating what the code does (the original file has no comments and this edit needs no constraint comment).
- The code contains no change markers or reviewer-addressed annotations such as "// added", "// NEW", "// changed", or "// timeout logic here".
- Statements in the updated code omit trailing semicolons and use single quotes for string literals, matching the existing file's style exactly.
- fetchOrders is not modified: either it is not shown, or if the full file is shown it is byte-identical to the original (no timeout added to it unasked).
- The timeout mechanism shown is functional JavaScript: an AbortSignal (e.g. AbortSignal.timeout(5000), or an AbortController whose signal is passed to fetch with a setTimeout/clearTimeout around it) — not pseudocode or a nonexistent fetch option like { timeout: 5000 }.
