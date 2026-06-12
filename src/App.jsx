import { useState, useEffect, useRef } from "react"
import { GoogleGenerativeAI } from "@google/generative-ai"
import gopiImg from "./assets/gopi.jpg"
import priyaImg from "./assets/priya.jpg"
import arjunImg from "./assets/arjun.jpg"
import EmojiPicker from "emoji-picker-react"

function App() {
  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY)
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })
  const [selectedUser, setSelectedUser] = useState("Gopi")
  const [showChat, setShowChat] = useState(false)
  const [pressTimer, setPressTimer] = useState(null)
  const [arjunOnline, setArjunOnline] = useState(false)
  useEffect(() => {
  setTimeout(() => {
    setArjunOnline(true)
  }, 10000)
}, [])
useEffect(() => {

  if (arjunOnline && pendingArjunReplies.length > 0) {

    pendingArjunReplies.forEach((reply, index) => {

      setTimeout(() => {

        setAllChats((prev) => ({
          ...prev,
          Arjun: [
            ...prev.Arjun,
            reply
          ]
        }))

      }, (index + 1) * 1000)

    })

    setPendingArjunReplies([])

  }

}, [arjunOnline])
  const users = [
  {
    name: "Gopi",
    status: "Online",
    avatar: gopiImg
  },
  {
    name: "Priya",
    status: "Online",
    avatar: priyaImg
  },
  {
    name: "Arjun",
    status: arjunOnline ? "Online" : "Offline",
    avatar: arjunImg
  }
]       
  const [allChats, setAllChats] = useState(() => {

  const savedChats =
    localStorage.getItem("quickchat")

  return savedChats
    ? JSON.parse(savedChats)
    : {
        Gopi: ["Hello Gopi 👋"],
        Priya: ["Hi Priya 😄"],
        Arjun: ["Hey Arjun 🔥"]
      }

})
  const [message, setMessage] = useState("")
  const [search, setSearch] = useState("")
  const filteredUsers = users.filter((user) =>
  user.name.toLowerCase().includes(search.toLowerCase())
)
 const [typing, setTyping] = useState(false)
 const [unreadCounts, setUnreadCounts] = useState({
  Gopi: 0,
  Priya: 0,
  Arjun: 0
})
 const [pendingArjunReplies, setPendingArjunReplies] = useState([])
 const [replyTo, setReplyTo] = useState(null)
 const [showProfile, setShowProfile] = useState(false)
 const [showEmojiPicker, setShowEmojiPicker] = useState(false)
 const [selectedImage, setSelectedImage] = useState(null)

  const chatEndRef = useRef(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: "smooth"
    })
  }, [allChats, selectedUser])
  useEffect(() => {

  localStorage.setItem(
    "quickchat",
    JSON.stringify(allChats)
  )

}, [allChats])
  const onEmojiClick = (emojiData) => {
    setMessage((prev) => prev + emojiData.emoji)
  }
  const handleImageUpload = (e) => {
  const file = e.target.files[0]

  if (!file) return

  const imageUrl = URL.createObjectURL(file)

  setAllChats((prev) => ({
  ...prev,
  [selectedUser]: [
    ...prev[selectedUser],
    {
      image: imageUrl,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      sender: "me",
    },
  ],
}))
  
  
}
  const sendMessage = async () => {

    if (message.trim() === "") return

    const userMessage = message
    const currentTime = new Date().toLocaleTimeString([], {
  hour: "2-digit",
  minute: "2-digit"
})

    setAllChats((prev) => ({
      ...prev,
      [selectedUser]: [
        ...prev[selectedUser],
        {
  text: userMessage,
  replyTo: replyTo?.text || null,
  time: currentTime,
  sender: "me"
}
      ]
    }))
    if (selectedUser === "Arjun" && !arjunOnline) {
  setPendingArjunReplies((prev) => [...prev, userMessage])
  setMessage("")
  return
}
    setMessage("")
    setReplyTo(null)
    setTyping(true)

   try {

  let personality = ""

if (selectedUser === "Gopi") {
  personality = "You are Gopi, a close friend. Reply like a real WhatsApp friend."
}
else if (selectedUser === "Priya") {
  personality = "You are Priya, a friendly girl. Reply naturally like a real friend."
}
else if (selectedUser === "Arjun") {
  personality = "You are Arjun, a cool friend. Reply casually."
}

const result = await model.generateContent(`
${personality}

Rules:
- Never say you are AI.
- Never say you are Gemini.
- Never say you are ChatGPT.
- Reply like a real friend.
- Keep replies short.
- If user types English, reply only English.
- If user types Telugu in English letters, reply in Telugu using English letters.
- Never use Telugu script.

User: ${userMessage}
`)

const aiReply = result.response.text()

  setTyping(false)

  setAllChats((prev) => ({
    ...prev,
    [selectedUser]: [
      ...prev[selectedUser],
      {
        text: aiReply,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit"
        }),
        sender: "other"
      }
    ]
  }))

} catch (error) {
  console.log(error)

  const teluguWordList = [
    "emi","ela","cheppu","cheppandi","memu","meeru","nenu","nuvvu","okka","anni",
    "undi","ledu","ayindi","chudandi","cheyyi","cheyandi","pani","matladudam",
    "adugutunna","chustunna","vachadu","velladu","vacha","vella","padadu",
    "padindi","chala","konjam","bagundi","bagunna","sari","sare","otay",
    "ante","inka","mari","ra","da","anna","akka","mama","macha",
    "evadu","evaru","ekkada","enduku","enni","eppudu","entlo","entha",
    "naaku","niku","meeku","vallu","vadu","aame","tindam","veldam",
    "poyam","vastam","istam","telusaa","telusa","cheppinav","cheppindi",
    "cheppanu","adigav","adigindi","adugutav","em","enti","endhi","kaadu",
    "ledhu","leka","kuda","kani","aithe","ayithe","ayina","pakka",
    "baaga","bavundi","manchidi","chestunna","chestadu","chesindi",
    "chesav","chesanu","cheppav","tinnava","tinna","bore","intlo",
    "unnav","unna","unnam","vasthav"
  ]

  const words = userMessage.toLowerCase().trim().split(/\s+/)
  const teluguCount = words.filter(w => teluguWordList.includes(w)).length
  const isTelugu = teluguCount > 0 && (teluguCount / words.length) >= 0.3
  const lang = isTelugu ? "te" : "en"

  const detectIntent = (text) => {
    const t = text.toLowerCase().trim()
    if (/^(hi|hello|hey|hlo|hii|hai|yo)\b/.test(t)) return "greeting"
    if (/\b(bye|byee|bb|good ?bye|tata|cya)\b/.test(t)) return "bye"
    if (/how are you|howru|how r u|ela unnav|ela unna|emi chestunav|emi chestav/.test(t)) return "howru"
    if (/\b(thanks|thank you|thanku|thx|thanks da|thanks ra)\b/.test(t)) return "thanks"
    if (/good ?morning|subhodayam|shubhodayam/.test(t)) return "gm"
    if (/good ?night|shubha raatri|shubharaatri|good nite/.test(t)) return "gn"
    if (/joke|jokes|funny|navvinchu|comedy/.test(t)) return "joke"
    if (/\b(ok|okay|otay|sare|sari|k)\b/.test(t)) return "ok"
    if (/love|nenu ninnu|nee meeda|na meeda/.test(t)) return "love"
    if (/busy|pani chestunna|work chestunna|time ledu/.test(t)) return "busy"
    if (/what are you doing|em chestunav|emi chestav|what r u doing/.test(t)) return "whatdoing"
    if (/\b(bored|boring|timepass)\b/.test(t)) return "bored"
    if (/\b(tinnava|tinna|food|eat|lunch|dinner|breakfast)\b/.test(t)) return "food"
    if (/\b(sleep|nidra|paduko|sleepy)\b/.test(t)) return "sleep"
    if (/\b(ekkada|where are you|where r u)\b/.test(t)) return "where"
    if (/\b(why|enduku|endhuku)\b/.test(t)) return "why"
    return "default"
  }

  const fallbacks = {
    en: {
      greeting: [
        "Hey! What's up?", "Hi bro! How's your day going?", "Yo! Long time 😄",
        "Heyy! How's it going?", "Hii! What's good?", "Wassup!", "Finally you texted 😄"
      ],
      bye: [
        "Bye! Take care 👋", "Okay bye, talk later!", "Later! 😄",
        "Byee, don't miss me too much 😜", "bye! 👋", "Byee, ping me later!"
      ],
      howru: [
        "I'm good, what about you?", "Doing great bro 😄", "All good here. You?",
        "Chilling. You?", "Pretty good! Wbu?", "Not bad! You?"
      ],
      thanks: [
        "Anytime! 😄", "No problem!", "That's what friends are for 😄",
        "Of course!", "Arey, mention not!", "Always there for you 😊"
      ],
      gm: [
        "Good morning! ☀️ Have a great day!", "Morning! Rise and shine 😄",
        "Good morning! ☀️ Coffee ready?", "Morning bro! Big day today?"
      ],
      gn: [
        "Good night! 🌙 Sweet dreams!", "Night night! 😴",
        "Good night! Sleep well 🌙", "Gn! Rest well 😄"
      ],
      joke: [
        "Why did the phone go to school? To improve its cell-f! 😂",
        "I told a joke about construction... still working on it 😄",
        "Why is math so sad? Because it has too many problems 😂",
        "My wifi password is wrong... No it's not, that's literally the password 😂"
      ],
      ok: [
        "Okay 👍", "Sure!", "Alright!", "Cool cool", "Noted 😄", "Yep!", "Got it!"
      ],
      love: [
        "Aww 😄 stop it you!", "Haha okay okay 😄", "Chill bro 😂", "Arey 😄"
      ],
      busy: [
        "No worries, ping me when free!", "Okay okay, go finish your work 😄",
        "Alright, we'll talk later!", "Sure, don't let me disturb you 😄"
      ],
      whatdoing: [
        "Nothing much, just chilling. You?", "Just scrolling through my phone 😄",
        "Watching random videos 😂", "Just vibing bro. Wbu?",
        "Kinda bored. What's up?", "Nothing productive tbh 😄 You?"
      ],
      bored: [
        "Same bro 😂", "Let's talk then 😄", "Watch a movie maybe?",
        "Bored gang 😂", "Scroll reels 😄", "Same energy here 😭"
      ],
      food: [
        "Yeah, I just ate 😄", "Not yet bro 😂", "What did you eat?",
        "Don't talk about food bro, I'm hungry 😂", "That sounds delicious 🤤"
      ],
      sleep: [
        "Sleepy already? 😴", "Go get some rest bro 😄", "Don't stay up too late 😂",
        "Zzz mode activated? 😴"
      ],
      where: [
        "At home bro 😄", "Just chilling at home.", "Why? You coming? 😂",
        "Home only bro. Wbu?"
      ],
      why: [
        "Arey why not? 😄", "Long story 😂", "Don't even ask 😂", "That's complicated 😄"
      ],
      default: [
        "Really? 😮", "Interesting bro 👀", "Haha good one 😂", "Makes sense 😄",
        "Tell me more...", "No way 😂", "That's nice 😄", "I get what you mean.",
        "Sounds good bro.", "Fair enough 😄", "Okay I'm listening 👀", "Haha true 😂",
        "That's actually cool 😄", "Bro you're funny 😂", "Wait what? 😆"
      ]
    },
    te: {
      greeting: [
        "Hey ra! Ela unnav?", "Hii ra! Emi chestunav?", "Yo bro 😄",
        "Ra! Ela undi?", "Heyy! Chala rojulaiki 😄", "Wassup ra!"
      ],
      bye: [
        "Bye ra! Jagratha 👋", "Otay bye, tarvata matladudam!", "bye! 😄",
        "Byee, miss avutav 😜", "Sare bye, ping cheyyi tarvata!"
      ],
      howru: [
        "Bagunnanu ra, nuvvu?", "Super ga unna 😄", "Chill ga unna bro.",
        "Okay okay unna. Nuvvu?", "Alright unna ra! Nuvvu?"
      ],
      thanks: [
        "Arey mention not ra 😄", "Sare sare 😄",
        "Chill ra, idi chinna vishayam!", "Always unna ra 😊", "Manam friends kadha ra 😄"
      ],
      gm: [
        "Subhodayam! ☀️ Bagundi rojunu!", "Morning ra! Levu levu 😄",
        "Subhodayam! Coffee tiyyindi? ☕", "Morning! Busy ga unna?"
      ],
      gn: [
        "Shubha raatri! 🌙 Manchiga paduko!", "Night night! 😴",
        "Good night ra! Rest teesko 🌙", "Gn! Repu manchiga matladudam 😄"
      ],
      joke: [
        "Phone school ki enduku vellindi? Cell-f ni improve cheskovadam ki 😂",
        "Nenu joke cheppanu... still working on it 😄",
        "Mana life oka joke la undi bro 😂", "Arey arey chala funny ga undi 😂"
      ],
      ok: [
        "Sare 👍", "Otay!", "Alright ra!", "Cool cool", "Got it 😄", "Ayindi!", "Sari sari"
      ],
      love: [
        "Arey arey 😄 adi cheppakku!", "Haha okay okay ra 😄", "Chill macha 😂", "Arey nuvvu kuda 😄"
      ],
      busy: [
        "Sare ra, pani chesuko, tarvata matladudam!", "Okay okay, pani avagane ping cheyyi 😄",
        "Alright, disturb cheyyanu, go ra!", "Sare busy manushan, bye later 😄"
      ],
      whatdoing: [
        "Em ledu ra, just time pass 😄", "Phone chustunna bro 😂", "YouTube chustunna ra.",
        "Chill ga unna ra. Wbu?", "Bore ga unna 😂 Nuvvu?", "Nothing productive ra 😂 Nuvvu?"
      ],
      bored: [
        "Same ra 😂", "Matladudam ra 😄", "Oka cinema chudu bro.",
        "Bored gang 😂", "Reels chudu ra 😄", "Same energy ra 😭"
      ],
      food: [
        "Haa ippude tinna 😄", "Inka tinnaledu bro 😂", "Em tinnav ra?",
        "Food gurinchi matladakku, naaku aakali 😂", "Chala tasty ga undi anipistundi 🤤"
      ],
      sleep: [
        "Paduko ra 😴", "Nidra vastundi bro 😂", "Repu matladudam 😄",
        "Fight cheyyakku da, paduko 😄"
      ],
      where: [
        "Intlo unna ra 😄", "Home lone unna bro.", "Enduku ra? 😂",
        "Intlo ne bro. Nuvvu ekkada?"
      ],
      why: [
        "Arey enduku ledu? 😄", "Cheppudu lengthy story 😂", "Adugakku bro 😂", "Complicated ra 😄"
      ],
      default: [
        "Haha nijame ra 😄", "Alaa aa? 😮", "Interesting bro 👀", "Cheppu inka...",
        "Artham ayindi 😄", "No way ra 😂", "Bagundi bro 😄", "Nuvvu keka 😂",
        "Sare vinistunna 👀", "Manchi point ra 😄", "Haha good one 😂",
        "Adhi correct eh bro.", "Wait enti? 😂", "Classic ra 😆", "Mood ra 😂"
      ]
    }
  }

  const intent = detectIntent(userMessage)
  const pool = fallbacks[lang][intent] || fallbacks[lang]["default"]
  const fallbackReply = pool[Math.floor(Math.random() * pool.length)]

  setTyping(false)

  setAllChats((prev) => ({
    ...prev,
    [selectedUser]: [
      ...prev[selectedUser],
      {
        text: fallbackReply,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit"
        }),
        sender: "other"
      }
    ]
  }))

}
  }

  return (

    <div className="h-screen bg-gray-100 flex items-center justify-center p-2 md:p-5">

      <div className="w-full h-full md:w-[90%] md:h-[90vh] bg-white rounded-2xl shadow-2xl flex overflow-hidden flex-col md:flex-row">

        {/* Sidebar */}
        <div className={`${showChat ? "hidden md:block" : "block"} w-full md:w-[30%] bg-indigo-600 text-white p-5`}>

          <h1 className="text-3xl font-bold mb-6">
            QuickChat
          </h1>
          <input
             type="text"
             placeholder="Search user..."
             value={search}
             onChange={(e) => setSearch(e.target.value)}
             className="w-full p-3 mb-4 rounded-xl bg-white text-black border-2 border-indigo-300 focus:border-indigo-500 outline-none"
          />

         {filteredUsers.map((user, index) => (
         

            <div
              key={index}
                onClick={() => {
                setSelectedUser(user.name)
                setShowChat(true)

                setUnreadCounts((prev) => ({
                  ...prev,
                [user.name]: 0
                }))
              }}

              className={`p-3 rounded-lg mb-3 flex items-center gap-3 cursor-pointer transition ${
                selectedUser === user.name
                  ? "bg-indigo-400"
                  : "bg-indigo-500"
              }`}
            >

              <div className="relative">
              <img  src={user.avatar} alt={user.name}
              className="w-12 h-12 rounded-full object-cover"/>

             {user.status === "Online" && (
             <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
             )}
             </div>
                <div className="flex items-center gap-2">
               <h2 className="font-semibold">
              {user.name}
              </h2>

              {unreadCounts[user.name] > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              {unreadCounts[user.name]}

              </span>
              )}
              </div>

               <p className="text-sm text-gray-200 truncate">
{
  allChats[user.name].length > 0
    ? (
        allChats[user.name][allChats[user.name].length - 1].image
          ? "📷 Photo"
          : (
              allChats[user.name][allChats[user.name].length - 1].text ||
              allChats[user.name][allChats[user.name].length - 1]
            )
      )
    : ""
}
</p>
              </div>

          ))}

        </div>

        {/* Chat Area */}
        <div className={`${showChat ? "flex" : "hidden md:flex"} w-full md:w-[70%] flex-col h-full overflow-hidden`}>

          {/* Top Bar */}
          <div className="bg-white p-5 border-b shadow-sm flex items-center gap-3 sticky top-0 z-50">
  
  <button
    onClick={() => setShowChat(false)}
    className="md:hidden text-2xl font-bold"
  >
    ←
  </button>

         <img
         src={users.find(user => user.name === selectedUser)?.avatar}
         alt={selectedUser}
        onClick={() => setShowProfile(true)}
        className="w-12 h-12 rounded-full object-cover cursor-pointer"
         />

  <div>
    <h2 className="text-xl font-semibold">
      {selectedUser}
    </h2>

    <p className="text-sm text-gray-500">
      {selectedUser === "Arjun"
        ? (arjunOnline ? "🟢 Online" : "Last seen recently")
        : "🟢 Online"}
    </p>
  </div>

</div>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gray-50 min-h-0">

            {allChats[selectedUser].map((msg, index) => (

              <div
                key={index}
               onDoubleClick={() => setReplyTo(msg)}

onTouchStart={() => {
  const timer = setTimeout(() => {
    if (window.confirm("Delete this message?")) {
      setAllChats((prev) => ({
        ...prev,
        [selectedUser]: prev[selectedUser].filter(
          (_, i) => i !== index
        )
      }))
    }
  }, 700)

  setPressTimer(timer)
}}

onTouchEnd={() => {
  clearTimeout(pressTimer)
}}

onContextMenu={(e) => {
  e.preventDefault()

  if (window.confirm("Delete this message?")) {
    setAllChats((prev) => ({
      ...prev,
      [selectedUser]: prev[selectedUser].filter(
        (_, i) => i !== index
      )
    }))
  }
}}
                

                className={`p-3 rounded-2xl w-fit max-w-[80%] shadow ${
                msg.sender === "me"
               ? "bg-gray-300 ml-auto"
               : "bg-indigo-600 text-white"
                }`}
              >
                <div>

              {msg.replyTo && (
              <div className="border-l-4 border-indigo-500 pl-2 mb-1 text-xs opacity-70">
              ↩ {msg.replyTo}
              </div>
              )}

              {msg.image ? (
              <img
              src={msg.image}
              alt="sent"
              className="max-w-[200px] rounded-xl"
              />
             ) : (
            msg.text || msg
           )}

              </div>
               <div className="text-xs opacity-70 mt-1">
              {msg.time || ""}
               </div>
              </div>

            ))}
           {typing && (
          <div className="flex gap-1 ml-2">
          <span className="animate-bounce">●</span>
          <span className="animate-bounce [animation-delay:0.2s]">●</span>
          <span className="animate-bounce [animation-delay:0.4s]">●</span>
          </div>
          )}
            <div ref={chatEndRef}></div>

          </div>

          {/* Input */}
          <div className="p-3 border-t flex gap-1 bg-white items-center sticky bottom-0 z-50">
          {replyTo && (
          <div className="bg-gray-200 p-2 rounded-lg mb-2">
          <p className="text-xs text-gray-600">
           Replying to:
          </p>
          <p className="text-sm">
          {replyTo.text || replyTo}
          </p>

          <button
          onClick={() => setReplyTo(null)}
          className="text-red-500 text-xs"
           >
        Cancel
    </button>
  </div>
)}
           <button
           onClick={() => setShowEmojiPicker(!showEmojiPicker)}
           className="text-2xl"
           >
           😀
           </button>
           <label className="text-2xl cursor-pointer">
           📷
          <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
          />
          </label>
            <input
              type="text"
              placeholder="Type a message..."
              value={message}

              onChange={(e) =>
                setMessage(e.target.value)
              }

              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendMessage()
                }
              }}

              className="flex-1 min-w-0 border rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-400"
            />
            {showEmojiPicker && (
            <div className="absolute bottom-16 left-2 z-50">
           <EmojiPicker onEmojiClick={onEmojiClick} />
           </div>
            )}
            <button
              onClick={sendMessage}

              className="bg-indigo-600 hover:bg-indigo-500 text-white px-2 py-2 rounded-xl transition shrink-0 text-sm"
            >
              Send
            </button>
            <button
           onClick={() => {
           setAllChats((prev) => ({
           ...prev,
      [selectedUser]: []
    }))
  }}
  className="bg-red-500 hover:bg-red-600 text-white px-2 py-2 rounded-xl shrink-0 text-sm"
>
  Clear
</button>
         {showProfile && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
    <div className="bg-white p-6 rounded-2xl w-80 text-center">

      <img
        src={users.find(user => user.name === selectedUser)?.avatar}
        alt={selectedUser}
        className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
      />

      <h2 className="text-2xl font-bold">
        {selectedUser}
      </h2>

      <p className="text-gray-500 mt-2">
        {selectedUser === "Arjun"
          ? (arjunOnline ? "🟢 Online" : "⚫ Offline")
          : "🟢 Online"}
      </p>

      <p className="mt-3">
        Messages: {allChats[selectedUser].length}
      </p>

      <button
        onClick={() => setShowProfile(false)}
        className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg"
      >
        Close
      </button>

    </div>
  </div>
)}
          </div>

        </div>

      </div>

    </div>
  )
}

export default App