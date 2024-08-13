import { App, ExpressReceiver } from '@slack/bolt'
import axios from 'axios'
import { onRequest } from 'firebase-functions/v2/https'

// Create a slack receiver
function createReceiver() {
  const receiver = new ExpressReceiver({
    signingSecret: process.env.SLACK_SIGNING_SECRET || '',
    endpoints: '/events',
    processBeforeResponse: true,
  })

  const app = new App({
    receiver: receiver,
    token: process.env.SLACK_BOT_TOKEN,
    processBeforeResponse: true,
    port: 5001,
  })

  app.event('app_mention', async ({ event, context, client, say }) => {
    const { bot_id: botId, text: rawInput, channel } = event
    const { retryNum } = context
    const ts = event.thread_ts || event.ts

    if (retryNum) return // skip if retry
    if (botId) return // skip if bot mentions itself

    // thinking...
    const botMessage = await say({
      thread_ts: ts,
      text: 'typing...',
    })
    if (!botMessage.ts) return // skip if failed to send message

    const input = rawInput.replace(/<@.*?>/, '').trim() // delete mention

    // call Dify API
    const data = {
      inputs: {},
      query: input,
      response_mode: 'blocking',
      user: 'abc-123', // TODO: dummy user id
    }
    const result = await axios.post('https://api.dify.ai/v1/chat-messages', data, {
      headers: {
        Authorization: `Bearer ${process.env.DIFY_API_KEY}`,
        'Content-Type': 'application/json',
      },
    })
    const answer = result.data.answer
    console.log('💖answer', answer)

    await client.chat.update({
      channel,
      ts: botMessage.ts as string,
      text: answer,
    })
  })
  return receiver
}

export const slack = onRequest(
  { secrets: ['DIFY_API_KEY', 'SLACK_BOT_TOKEN', 'SLACK_SIGNING_SECRET'] },
  async (req, res) => {
    return createReceiver().app(req, res)
  },
)
