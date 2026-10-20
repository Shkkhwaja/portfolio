/** Provider + limits. Swap provider by changing env vars — no code changes needed (any OpenAI-compatible API works). */
export const CHAT_CONFIG = {
  model: process.env.NVIDIA_MODEL || 'nvidia/nemotron-3.5-super-vl-120b-a12b',
  baseURL: process.env.NVIDIA_BASE_URL || 'https://integrate.api.nvidia.com/v1',
  temperature: 0.7,
  topP: 0.95,
  maxTokens: 1024,
  upstreamTimeoutMs: 45_000,
}

export const CHAT_LIMITS = {
  maxMessages: 12, // history turns accepted per request
  maxMessageChars: 1000, // per visitor message
  maxAssistantChars: 4000, // per echoed assistant message (truncated, not rejected)
  maxBodyBytes: 80_000, // whole request body
  rateWindowMs: 60_000,
  rateMaxRequests: 8, // per IP per window
}
