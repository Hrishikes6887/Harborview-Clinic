export type ChatMessage = {
  id: string
  role: 'user' | 'assistant'
  content: string
}

export type ChatbotResponse = {
  reply: string
  conversationId: string
}

const conversationStorageKey = 'harborview-chat-conversation-id'
const requestTimeoutMs = 15000
const placeholderReplies = new Set(['ai agent output', 'output'])

function getConversationId(): string {
  const existingId = window.sessionStorage.getItem(conversationStorageKey)
  if (existingId) return existingId

  const newId = crypto.randomUUID()
  window.sessionStorage.setItem(conversationStorageKey, newId)
  return newId
}

export async function sendChatMessage(message: string): Promise<ChatbotResponse> {
  const trimmedMessage = message.trim()
  if (!trimmedMessage) {
    throw new Error('Please enter a message.')
  }

  const webhookUrl = import.meta.env.VITE_N8N_CHAT_WEBHOOK_URL
  if (!webhookUrl) {
    throw new Error('Chat service is not configured.')
  }

  const conversationId = getConversationId()
  const controller = new AbortController()
  const timeout = window.setTimeout(() => controller.abort(), requestTimeoutMs)

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: trimmedMessage, conversationId }),
      signal: controller.signal,
    })

    if (!response.ok) {
      throw new Error('Chat service request failed.')
    }

    const responseText = (await response.text()).trim()
    if (!responseText) {
      throw new Error('Chat service returned an invalid response.')
    }

    let reply = responseText
    try {
      const parsed: unknown = JSON.parse(responseText)
      if (typeof parsed === 'string') {
        reply = parsed.trim()
      } else if (parsed && typeof parsed === 'object') {
        const payload = parsed as { output?: unknown; reply?: unknown }
        const candidate = payload.output ?? payload.reply
        if (typeof candidate === 'string') {
          reply = candidate.trim()
        }
      }
    } catch {
      // n8n is configured to return plain text; keep the text as-is.
    }

    if (!reply || placeholderReplies.has(reply.toLowerCase()) || /^[{\[].*[}\]]$/s.test(reply)) {
      throw new Error('Chat service returned an invalid response.')
    }

    return { reply, conversationId }
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new Error('The chat is taking too long to respond.')
    }
    throw error
  } finally {
    window.clearTimeout(timeout)
  }
}
