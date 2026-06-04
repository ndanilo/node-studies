# Cursor Rule Template

Copy this file to `.cursor/rules/NN-topic-name.mdc` when adding a new learning topic.

---

## Frontmatter (required)

```yaml
---
description: One-line description shown in Cursor rule picker
globs: "**/*.{ts,js}"   # or alwaysApply: true for global rules
alwaysApply: false
---
```

## Content Structure

Keep each rule **under ~50 lines**. One topic per file.

```markdown
# Topic Title

## C# Mental Model
Brief C# equivalent or what the user already knows.

## JavaScript / TypeScript Way
Idiomatic pattern with a short code example.

## Key Differences
| C# | JS/TS |
|----|-------|
| ... | ... |

## Common Mistakes
- Footgun 1
- Footgun 2

## Applied AI Note (optional)
How this shows up in LLM/agent projects.
```

## Topics to Add Later (suggested)

Create rules as you reach each phase:

| File | Topic |
|------|-------|
| `07-streaming-sse.mdc` | SSE, streaming LLM tokens |
| `08-zod-validation.mdc` | Runtime validation for API/LLM JSON |
| `09-express-middleware.mdc` | Express middleware pipeline |
| `10-vitest-testing.mdc` | Unit testing in Node |
| `11-openai-sdk.mdc` | OpenAI Node SDK patterns |
| `12-agent-tools.mdc` | Function calling and tool loops |

After creating a rule, add a checkbox to the relevant phase in `docs/LEARNING-PLAN.md`.
