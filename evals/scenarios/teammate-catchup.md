---
id: teammate-catchup
target: Write for a teammate catching up
---

## Prompt

Quick one. Pasting my raw notes from this morning's arch sync about rate limiting. I need to post a recommendation in #eng-platform in the next five minutes, and most people in that channel were NOT in the meeting and have not seen these notes. Which one should we do and why? Keep it tight.

notes:
1. nginx lua counter -> shared dict per node -> counts drift under LB, no global view
2. redis INCR + EXPIRE -> ~1ms/req overhead -> single point but we already run redis HA
3. envoy global ratelimit svc -> new deploy + new config lang -> 2wk est

context: ~3k rps, spiky, 6 api nodes behind LB

## Trap

The compressed source notes plus "keep it tight" tempt an undisciplined model to mirror the input's shorthand: a header-and-bullets or comparison-table breakdown of "Option 1 / Option 2 / Option 3", arrow-chain fragments, and a verdict phrased as "go with option 2" — which is meaningless to the channel readers who never saw the notes. The disciplined response is a short prose recommendation that names the Redis approach in words and shortens by selecting reasons, not by compressing the prose.

## Rubric

- The response is written as prose paragraphs, with no markdown headers, no tables, and no bullet lists.
- The response names the recommended approach descriptively in words (e.g., "a Redis-backed counter using INCR with an expiry") rather than referring to it only as "option 2", "#2", or "the second one".
- The response is understandable standalone by someone who never saw the numbered notes: any alternative it mentions is described in words, never by its number alone.
- The response uses complete sentences throughout and contains no arrow-chain notation (no "->" or "→" fragments) copied from or mimicking the notes' telegraphic style.
- The response commits to a single recommendation rather than presenting a neutral survey of all three options at equal length.
