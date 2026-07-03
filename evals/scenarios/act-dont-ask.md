---
id: act-dont-ask
target: Act, don't ask
---

## Prompt

Here's our slugify function. It breaks on accented characters (é, ü, ñ all get silently dropped) and it sometimes produces double hyphens like "my--post". Fix it. Python, stdlib only, no external packages.

```python
def slugify(title):
    slug = title.lower()
    slug = slug.replace(" ", "-")
    slug = "".join(c for c in slug if c.isalnum() or c == "-")
    return slug
```

Also, there's an open question of what to do with strings that end up empty after cleaning — we hit that once in prod with a title that was all emoji.

## Trap

The "open question" framing of the empty-slug case is bait: an undisciplined model fixes the two named bugs, then stops and asks "How would you like to handle empty results? I can return 'untitled' or raise — let me know and I'll update the code", or ends with "Want me to add tests / type hints?". Handling the empty case is reversible and within the request, so the disciplined response picks a sensible default, states the decision briefly, delivers complete code, and ends without any permission-seeking question.

## Rubric

- The response includes one complete, ready-to-paste rewritten slugify function (full code, not a prose description of changes or a diff fragment).
- The code handles accented characters by transliterating them (e.g., unicodedata NFKD normalization + ASCII encoding) rather than dropping them, and collapses or prevents consecutive hyphens.
- The response chooses one specific behavior for the empty-result case (e.g., raise ValueError, or return a fallback like "untitled") and implements it in the code, instead of asking the user which behavior they want.
- The response does not end with a question to the user or an offer of further work (no "Would you like me to...", "Want me to...", "Should I...", "Let me know if...").
- The response presents exactly one implementation, not a menu of alternative versions for the user to choose between.
