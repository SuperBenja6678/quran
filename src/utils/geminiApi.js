// Gemini API utility for AI tafseer with chat support
const GEMINI_API_KEY = 'AIzaSyAW5pleVSzDt2Vjw0p3w0zpWVPZF8-Uq90'
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent'

export const getTafseer = async (ayah, surah) => {
  try {
    const prompt = `Please provide a tafseer (explanation) of the following Quranic ayah:

Surah: ${surah.englishName} (${surah.name})
Ayah Number: ${ayah.numberInSurah}
Text: ${ayah.text}

Please provide a clear and insightful explanation of this ayah, including its context and meaning.`

    const response = await fetch(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      }
    )

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()
    
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      return data.candidates[0].content.parts[0].text
    }
    
    throw new Error('Invalid response format')
  } catch (error) {
    console.error('Error fetching tafseer:', error)
    throw error
  }
}

// Chat with Gemini about an ayah
export const sendChatMessage = async (messages, ayah, surah) => {
  try {
    // Gemini v1beta API requires explicit role fields in the contents array
    // Role must be 'user' or 'model' (not 'assistant')
    // Without roles, Gemini treats all messages as user inputs and resets the conversation
    
    const contents = messages.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.text }]
    }))

    // Debug: log the conversation structure
    console.log('Sending conversation to Gemini:', {
      messageCount: contents.length,
      lastMessage: messages[messages.length - 1]?.text?.substring(0, 100) + '...',
      structure: messages.map((m, i) => `${i}: ${m.role}`).join(', ')
    })

    const response = await fetch(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: contents
        })
      }
    )

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(`API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`)
    }

    const data = await response.json()
    
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      return data.candidates[0].content.parts[0].text
    }
    
    throw new Error('Invalid response format')
  } catch (error) {
    console.error('Error sending chat message:', error)
    throw error
  }
}

// Initialize tafseer chat with context
export const initializeTafseerChat = async (ayah, surah) => {
  try {
    // Combined message: system prompt + tafseer request
    // Structured so system prompt is general and ayah info is in the request part
    const message = `You are a helpful Islamic scholar providing tafseer (explanation) of Quranic verses. 

When providing tafseer, be concise and insightful. Be brief for straightforward concepts, but expand with context when discussing important theological points, historical background, or complex themes. Format your response using markdown:
- Use **bold** for key concepts
- Use bullet points (-) for lists
- Use numbered lists (1., 2.) for sequential points
- Use *italics* for emphasis
- Keep paragraphs short and focused

You can answer follow-up questions about any ayah that is discussed.

---

Please provide tafseer for the following ayah:

Surah: ${surah.englishName} (${surah.name})
Ayah Number: ${ayah.numberInSurah}
Ayah Text: ${ayah.text}`

    const response = await fetch(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            role: 'user',
            parts: [{ text: message }]
          }]
        })
      }
    )

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()
    
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      return data.candidates[0].content.parts[0].text
    }
    
    throw new Error('Invalid response format')
  } catch (error) {
    console.error('Error initializing tafseer chat:', error)
    throw error
  }
}
