import { GoogleGenAI } from '@google/genai'

export interface ChatMessage {
  role: 'user' | 'model'
  text: string
}

const SYSTEM_INSTRUCTION = `
You are the EcoHoops AI Coach, a digital extension of Coach Adrian's youth basketball movement in Mississauga, Ontario.
Your coaching methodology is built on:
1. Constraints-Led Approach (CLA) & Ecological Dynamics: We do not believe in drilling isolated skills in a vacuum (like dribbling cones in a straight line). Instead, we believe in creating representative learning environments. You must advise players and coaches to use small-sided games, modify constraints (like changing court boundaries, point systems, dribble limits, or player numbers), and encourage players to discover their own movement solutions through active search.
2. Mental Health & Article 31: Normalizing mental wellness on and off the court. We combat pressure and burnout by emphasizing psychological safety, play, and intrinsic motivation. You believe "the opposite of play is not work, it's depression" (Dr. Stuart Brown) and you reference Article 31 of the UN Convention on the Rights of the Child (the right to play and leisure).
3. Accessibility & Community: Basketball must be accessible to all youth from every socioeconomic background.

Persona & Tone:
- Tone: Street-smart, high-energy, positive, encouraging, and deeply grounded in motor learning science.
- Style: Use active basketball slang and GTA-adjacent expressions naturally ("What's good!", "Let's work. 🏀", "squad", "baller", "court vision", "IQ", "Affordances").
- Keep your answers relatively punchy, structured, and action-oriented. Provide specific drills or constraint-led game ideas when asked.

Always sign off with energy, reminding them to play, learn, and grow.
`

export function getStoredApiKey(): string {
  return (
    import.meta.env.VITE_GEMINI_API_KEY ||
    localStorage.getItem('ecohoops_gemini_api_key') ||
    ''
  )
}

export function setStoredApiKey(key: string): void {
  localStorage.setItem('ecohoops_gemini_api_key', key)
}

export function clearStoredApiKey(): void {
  localStorage.removeItem('ecohoops_gemini_api_key')
}

export async function askAICoach(
  messages: ChatMessage[],
  customApiKey?: string
): Promise<string> {
  const apiKey = customApiKey || getStoredApiKey()
  
  if (!apiKey) {
    throw new Error('API Key is required for live AI Coach responses.')
  }

  try {
    const ai = new GoogleGenAI({ apiKey })
    
    // Seed chat history using chats.create
    // We take all messages except the last one as history, and send the last one as the new message
    const history = messages.slice(0, -1).map((msg) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }],
    }))

    const lastMessage = messages[messages.length - 1]

    const chat = ai.chats.create({
      model: 'gemini-2.0-flash',
      history: history as any,
    })

    const response = await chat.sendMessage({
      message: lastMessage.text,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    })

    return response.text || 'My bad, I couldn\'t formulate an answer. Let\'s try that again.'
  } catch (error: any) {
    console.error('Error calling Gemini API:', error)
    throw new Error(error.message || 'Failed to generate response from Gemini.')
  }
}

// Fallback smart simulation for Demo Mode
export function getSimulatedResponse(input: string): string {
  const normalized = input.toLowerCase()
  
  if (normalized.includes('drill') || normalized.includes('practice') || normalized.includes('train')) {
    return `Love that you're asking about training. In EcoHoops, we don't do boring cone drills! Let's get a CLA drill going called **"The Space Invader"**:
    
🏀 **Drill: The Space Invader (3v3 Constraint Game)**
*   **Setup:** Half court. The offense gets 3 players, defense gets 3.
*   **Constraint:** The offense is restricted to a maximum of **2 dribbles** per possession. Furthermore, every player on defense must keep one hand behind their back.
*   **Goal:** This forces the offense to use off-ball cuts, fast passing, and attuning to open spaces (affordances) rather than over-dribbling. The defensive constraint forces defenders to move their feet instead of reaching.
    
Give this a run with your squad and let me know how they adapt! Play. Learn. Grow. 🏀`
  }

  if (normalized.includes('mental') || normalized.includes('wellness') || normalized.includes('burnout') || normalized.includes('health')) {
    return `Normalizing mental wellness is core to our entire DNA! As Dr. Stuart Brown famously said, *"The opposite of play is not work, it's depression."* 
    
In youth sports today, there's too much hyper-competitive pressure, leading to anxiety and burnout. Here is how we run things to build resilient minds:
1. **Psychological Safety:** No child is scolded for a turnover. Mistake-making is part of structural exploration!
2. **Article 31 Advocacy:** We prioritize the child's right to rest, leisure, and free play.
3. **Check-ins:** Always start and end practice with a brief mental check-in. Ask the kids what they are excited about, not just how they want to perform.

A happy, secure baller is a creative baller. Let's keep building minds, not just pros! 🏀`
  }

  if (normalized.includes('philosophy') || normalized.includes('eco') || normalized.includes('cla') || normalized.includes('ecological')) {
    return `What's good! Let's talk shop. Our philosophy merges **Ecological Dynamics** with **Constraints-Led Learning (CLA)**.
    
In traditional training, players memorize plays like robots. But on the street court, things are alive and fluid. 
*   **Ecological Dynamics** says that behavior is formed by the relationship between the player, the task, and the environment.
*   **Affordances** are action possibilities. We train players to read these affordances (e.g., recognizing a gap in the defense, seeing a teammate's cutting vector).
*   **Constraints** are the tools we use to guide them. By changing constraints (balls, court sizes, rules), we force the player's brain to self-organize the best motor solution.

This is how we build real basketball IQ. No templates, just adaptable ballers! Let's work. 🏀`
  }

  if (normalized.includes('game') || normalized.includes('strategy') || normalized.includes('defense') || normalized.includes('offense')) {
    return `Let's break down strategy. In the EcoHoops system, we don't draw up 50 static plays on a clipboard. We build dynamic game-principles!
    
For example, on **Offense**, we teach the principle of **"Spatial Attunement"**—reading spacing. Instead of standing in a spot because "the play said so," players must continuously adjust their spacing relative to their teammates and the ball.
    
For **Defense**, we focus on **"Interpersonal Distance"**—manipulating how close we are to force the ball handler into making rushed decisions. A great constraint to train this is to play a 4v4 game where the defense gets double points for intercepting passes, forcing them to play aggressive passing lanes.
    
What specific strategy or match-up are you working on right now? 🏀`
  }

  return `What's good! I'm loving the energy. That's a great topic to dig into.

In the EcoHoops movement, everything we do is about helping our players discover their potential through play, exploration, and structured challenges. Whether we're designing small-sided games or normalizing mental health conversations, we focus on the whole person.

Ask me about:
*   **Specific Drills** (e.g., "Give me a shooting drill with constraints")
*   **Our Philosophy** (e.g., "What is the Constraints-Led Approach?")
*   **Mental Health** (e.g., "How do we fight athlete burnout?")

Let's get to work! 🏀`
}
