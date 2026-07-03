---
id: simple-question
target: Write for a teammate catching up — match shape to the question
---

## Prompt

Quick question: in Postgres, is there any practical difference between varchar(255) and text?

## Trap

This is a one-sentence question, but the varchar-vs-text topic pattern-matches to a "comparison" answer. The undisciplined default produces a structured mini-article: a "## varchar(255)" / "## text" pair of headers or a comparison table, bullet lists of pros and cons, and a "When to use which" section — often importing MySQL folklore about varchar(255) being faster. The disciplined response is a few sentences of plain prose: in Postgres they are stored identically; varchar(n) just adds a length check; the common advice is to use text (optionally with a CHECK constraint) unless a hard limit is a real requirement.

## Rubric

- The response contains no markdown headers (no lines starting with #, ##, or ###) and no bold section labels used as headings.
- The response contains no bulleted or numbered lists.
- The response contains no tables (no markdown pipe tables or comparison grids).
- The response is a single paragraph of prose, five sentences or fewer.
- The first sentence directly answers the question: it states there is essentially no practical difference in Postgres beyond varchar(255) enforcing a length limit.
- The response is factually correct for Postgres: it does not claim varchar(255) is faster, more space-efficient, or stored differently than text.
