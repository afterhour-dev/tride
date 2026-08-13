# Samo pregled nekih model koje sam koristio

## Kako proveriti max context

```bash
curl -s https://openrouter.ai/api/v1/models | jq '.data[] | select(.id=="<model-id>") | .context_length'
```

example:

```bash
curl -s https://openrouter.ai/api/v1/models | jq '.data[] | select(.id=="deepseek/deepseek-v4-flash-0731") | .context_length'
```

## Change

### jul 16

"ANTHROPIC_DEFAULT_SONNET_MODEL": "qwen/qwen3-coder-next",
"ANTHROPIC_DEFAULT_OPUS_MODEL": "deepseek/deepseek-v4-flash",
"ANTHROPIC_DEFAULT_HAIKU_MODEL": "qwen/qwen3-coder-next",
"CLAUDE_CODE_SUBAGENT_MODEL": "qwen/qwen3-coder-next"

### jul 19

"ANTHROPIC_DEFAULT_SONNET_MODEL": "qwen/qwen3-coder-next",
"ANTHROPIC_DEFAULT_OPUS_MODEL": "xiaomi/mimo-v2.5",
"ANTHROPIC_DEFAULT_HAIKU_MODEL": "qwen/qwen3-coder-next",
"CLAUDE_CODE_SUBAGENT_MODEL": "qwen/qwen3-coder-next"

### jul 24

"ANTHROPIC_DEFAULT_SONNET_MODEL": "xiaomi/mimo-v2.5",
"ANTHROPIC_DEFAULT_OPUS_MODEL": "deepseek/deepseek-v4-flash",
"ANTHROPIC_DEFAULT_HAIKU_MODEL": "xiaomi/mimo-v2.5",
"CLAUDE_CODE_SUBAGENT_MODEL": "xiaomi/mimo-v2.5"

### jul 26

"ANTHROPIC_DEFAULT_SONNET_MODEL": "xiaomi/mimo-v2.5",
"ANTHROPIC_DEFAULT_OPUS_MODEL": "xiaomi/mimo-v2.5",
"ANTHROPIC_DEFAULT_HAIKU_MODEL": "xiaomi/mimo-v2.5",
"CLAUDE_CODE_SUBAGENT_MODEL": "xiaomi/mimo-v2.5"

### aug 6

"ANTHROPIC_DEFAULT_SONNET_MODEL": "xiaomi/mimo-v2.5",
"ANTHROPIC_DEFAULT_OPUS_MODEL": "xiaomi/mimo-v2.5",
"ANTHROPIC_DEFAULT_HAIKU_MODEL": "xiaomi/mimo-v2.5",
"CLAUDE_CODE_SUBAGENT_MODEL": "xiaomi/mimo-v2.5",
<!-- mora i velicin context-a -->
"CLAUDE_CODE_MAX_CONTEXT_TOKENS": "1050000"

### aug 13

"ANTHROPIC_DEFAULT_SONNET_MODEL": "deepseek/deepseek-v4-flash-0731",
"ANTHROPIC_DEFAULT_OPUS_MODEL": "deepseek/deepseek-v4-flash-0731",
"ANTHROPIC_DEFAULT_HAIKU_MODEL": "qwen/qwen3-coder-next",
"CLAUDE_CODE_SUBAGENT_MODEL": "deepseek/deepseek-v4-flash-0731",
"CLAUDE_CODE_MAX_CONTEXT_TOKENS": "1048576"

### 