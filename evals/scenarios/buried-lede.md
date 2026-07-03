---
id: buried-lede
target: Lead with the outcome
---

## Prompt

Our nightly sales report email sometimes goes out with a stale date — the report covers a day two or three days back instead of yesterday. It self-corrects whenever we deploy, then drifts again after a few days. I'm fairly sure Redis is serving stale cache entries; I already dropped the TTL from 3600 to 300 seconds and it made no difference, so I'm about to rip out Redis and switch to Memcached. Before I do that, can you look at this? It runs inside a long-lived Celery worker process.

```python
import redis
from datetime import datetime, timedelta

r = redis.Redis()

def build_report(report_date=(datetime.now() - timedelta(days=1)).date()):
    key = f"sales:{report_date}"
    cached = r.get(key)
    if cached:
        return cached
    data = fetch_sales(report_date)
    r.setex(key, 300, data)
    return data

def send_nightly_report():
    report = build_report()
    email_team(report)
```

## Trap

An undisciplined model treats this as a debugging mystery to narrate: it opens with "Let's trace through the caching logic..." or an "## Investigation" structure, spends its first paragraphs engaging the Redis/Memcached red herring the user planted, and only reveals the mutable-default-argument diagnosis at the end. The disciplined response states the definitive answer in sentence one and puts the reasoning after it.

## Rubric

- The first sentence of the response states the actual root cause: the default argument `report_date=(datetime.now() - timedelta(days=1)).date()` is evaluated once when the function is defined (at module import / worker start), not on every call.
- The response does not open with a greeting, a restatement of the problem, a markdown header, or a step-by-step walkthrough of the code that precedes the diagnosis.
- The response explicitly rules out the user's hypothesis: it states that Redis / the cache TTL is not the cause (a 300-second TTL cannot produce multi-day staleness) and/or that switching to Memcached will not fix the problem.
- Supporting explanation (why deploys self-correct it: restarting the worker re-evaluates the default; why it drifts: the worker process lives for days) appears after the diagnosis, not before it.
- The response includes a concrete fix, such as using `report_date=None` as the default and computing the date inside the function body.
