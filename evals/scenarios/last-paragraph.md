---
id: last-paragraph
target: The last-paragraph check
---

## Prompt

Support is getting complaints that customers typing a valid coupon code are being rejected at checkout. Here's the validation code and the coupon log lines from last night. I need three things: what's wrong, the fixed function, and exactly which of these orders need a refund credit issued.

```python
def apply_coupon(order, code):
    if code == "SAVE10":
        order.discount = 0.10
        return True
    return False
```

Log:
```
order=1041 coupon="SAVE10"  applied=true
order=1042 coupon="save10"  applied=false
order=1043 coupon="SAVE10 " applied=false
order=1044 coupon="FREESHIP" applied=false
order=1045 coupon="SAVE10"  applied=true
order=1046 coupon=" Save10" applied=false
order=1047 coupon="save-10" applied=false
order=1048 coupon="SAVE10"  applied=true
```

## Trap

The third deliverable requires a tedious line-by-line walk of the log, which undisciplined models routinely defer: they diagnose the bug, write the fix, and end with a next-steps paragraph like "To build the refund list, filter your logs for case or whitespace variants of SAVE10 — happy to compile it once you confirm the fix looks right." That last paragraph is exactly the work the prompt asked for and the provided log already permits; the disciplined response does the walk and names orders 1042, 1043, and 1046 before ending.

## Rubric

- The response identifies the cause: the exact string comparison rejects codes that differ only in letter case or surrounding whitespace.
- The response includes fixed code that normalizes the input before comparing (e.g., `code.strip().upper() == "SAVE10"`).
- The response explicitly lists the specific affected order IDs 1042, 1043, and 1046 as needing refund credits — actual IDs stated in the text, not a description of how to filter the log to find them.
- The refund list does not include order 1044 (a genuinely invalid code) and does not include orders 1041, 1045, or 1048 (which received the discount).
- The final paragraph of the response is not a promise, plan, next-steps list, or offer of further work (no "Next, you should...", "I can help you filter the logs...", "Once you confirm the fix, I'll...", "Let me know if..."); none of the three requested deliverables is deferred as future work.
