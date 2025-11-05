import { useState, useRef, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import { initializeTafseerChat, sendChatMessage } from '../utils/geminiApi'
import './TafseerChat.css'

function TafseerChat({ ayah, surah, onHide }) {
  console.log('TafseerChat rendered with ayah:', ayah, 'surah:', surah)
  
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [initializing, setInitializing] = useState(true)
  const [initialPrompt, setInitialPrompt] = useState(null)
  const messagesEndRef = useRef(null)
  const chatContainerRef = useRef(null)
  
  if (!ayah || !surah) {
    console.error('TafseerChat: Missing required props - ayah:', ayah, 'surah:', surah)
    return null
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Initialize chat with tafseer
    const initChat = async () => {
      setInitializing(true)
      try {
        // General system prompt - establishes role only
        const systemPrompt = `You are a helpful Islamic scholar providing tafseer (explanation) of Quranic verses. 

When providing tafseer, be concise and insightful. Be brief for straightforward concepts, but expand with context when discussing important theological points, historical background, or complex themes. Format your response using markdown:
- Use **bold** for key concepts
- Use bullet points (-) for lists
- Use numbered lists (1., 2.) for sequential points
- Use *italics* for emphasis
- Keep paragraphs short and focused

You can answer follow-up questions about any ayah that is discussed.`

        // Specific tafseer request - sent as a user message with ayah info
        const tafseerRequest = `Please provide tafseer for the following ayah:

Surah: ${surah.englishName} (${surah.name})
Ayah Number: ${ayah.numberInSurah}
Ayah Text: ${ayah.text}`

        // Store both separately for proper conversation flow
        setInitialPrompt(systemPrompt) // Store system prompt for filtering
        
        // Initialize chat - API will combine them internally
        const response = await initializeTafseerChat(ayah, surah)
        
        // Store messages: system prompt (user), tafseer request (user), assistant response
        // But for conversation history, we'll store them combined since that's what we sent
        const combinedInitialMessage = systemPrompt + '\n\n---\n\n' + tafseerRequest
        setMessages([
          { role: 'user', text: combinedInitialMessage },
          { role: 'assistant', text: response }
        ])
      } catch (error) {
        setMessages([{
          role: 'assistant',
          text: 'Sorry, I encountered an error while fetching the tafseer. Please try again.'
        }])
      } finally {
        setInitializing(false)
      }
    }

    initChat()
  }, [ayah.number, surah.number])

  const handleSend = async (e) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMessage = input.trim()
    setInput('')
    
    // Add user message to state immediately for UI feedback
    const updatedMessages = [...messages, { role: 'user', text: userMessage }]
    setMessages(updatedMessages)
    setLoading(true)

    try {
      // Send full conversation history including the new user message
      // messages array structure: [initialPrompt (user), firstResponse (assistant), userQuestion (user), ...]
      const response = await sendChatMessage(updatedMessages, ayah, surah)
      setMessages(prev => [...prev, { role: 'assistant', text: response }])
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        text: 'Sorry, I encountered an error. Please try again.'
      }])
    } finally {
      setLoading(false)
    }
  }

  const handleHide = () => {
    // Only hide if tafseer has been received (not during initialization)
    if (!initializing && messages.length > 0) {
      onHide()
    }
  }

  return (
    <div className="tafseer-chat-overlay" onClick={handleHide}>
      <div className="tafseer-chat-container" onClick={(e) => e.stopPropagation()}>
        <div className="tafseer-chat-header">
          <div className="chat-header-info">
            <h3>Tafseer Chat</h3>
            <p className="chat-ayah-info">
              {surah.englishName} - Ayah {ayah.numberInSurah}
            </p>
          </div>
          <div className="chat-header-actions">
            <button 
              className="chat-close-btn" 
              onClick={handleHide}
              disabled={initializing}
              title="Hide chat"
            >
              ×
            </button>
          </div>
        </div>
        <div className="tafseer-chat-messages" ref={chatContainerRef}>
          {initializing ? (
            <div className="chat-loading">
              <div className="loading-spinner"></div>
              <p>Getting tafseer...</p>
            </div>
          ) : (
            messages
              .filter(msg => {
                // Hide the system prompt from UI (first message)
                // Show the tafseer request (second message) and all subsequent messages
                return msg.role !== 'user' || !msg.text.includes('You are a helpful Islamic scholar')
              })
              .map((message, index) => (
              <div
                key={index}
                className={`chat-message ${message.role === 'user' ? 'user-message' : 'assistant-message'}`}
              >
                <div className="message-content">
                  {message.role === 'assistant' ? (
                    <ReactMarkdown>{message.text}</ReactMarkdown>
                  ) : (
                    message.text
                  )}
                </div>
              </div>
            ))
          )}
          {loading && (
            <div className="chat-message assistant-message">
              <div className="message-content">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form className="tafseer-chat-input" onSubmit={handleSend}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question about this ayah..."
            disabled={loading || initializing}
            className="chat-input-field"
          />
          <button
            type="submit"
            disabled={loading || initializing || !input.trim()}
            className="chat-send-btn"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  )
}

export default TafseerChat

