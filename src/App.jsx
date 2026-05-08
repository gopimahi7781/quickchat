import { useState, useEffect, useRef } from "react"

function App() {

  const users = [
    {
      name: "Gopi",
      status: "Online"
    },
    {
      name: "Priya",
      status: "Online"
    },
    {
      name: "Arjun",
      status: "Offline"
    }
  ]

  const [selectedUser, setSelectedUser] = useState("Gopi")

  const [allChats, setAllChats] = useState({
    Gopi: ["Hello Gopi 👋"],
    Priya: ["Hi Priya 😄"],
    Arjun: ["Hey Arjun 🔥"]
  })

  const [message, setMessage] = useState("")

  const chatEndRef = useRef(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: "smooth"
    })
  }, [allChats, selectedUser])

  const sendMessage = () => {

    if (message.trim() === "") return

    const userMessage = message

    setAllChats((prev) => ({
      ...prev,
      [selectedUser]: [
        ...prev[selectedUser],
        userMessage
      ]
    }))

    setMessage("")

    let reply = ""

    if (userMessage.toLowerCase().includes("hello")) {
      reply = "Hi 😄"
    }

    else if (userMessage.toLowerCase().includes("how are you")) {
      reply = "I am fine ❤️"
    }

    else if (userMessage.toLowerCase().includes("good")) {
      reply = "Great 🔥"
    }

    else {

      const randomReplies = [
        "Okay 👍",
        "Cool 😎",
        "Nice 🔥",
        "Wow 😄",
        "Awesome ❤️"
      ]

      reply =
        randomReplies[
          Math.floor(Math.random() * randomReplies.length)
        ]
    }

    setTimeout(() => {

      setAllChats((prev) => ({
        ...prev,
        [selectedUser]: [
          ...prev[selectedUser],
          reply
        ]
      }))

    }, 1000)
  }

  return (

    <div className="h-screen bg-gray-100 flex items-center justify-center p-2 md:p-5">

      <div className="w-full h-full md:w-[90%] md:h-[90vh] bg-white rounded-2xl shadow-2xl flex overflow-hidden flex-col md:flex-row">

        {/* Sidebar */}
        <div className="w-full md:w-[30%] bg-indigo-600 text-white p-5">

          <h1 className="text-3xl font-bold mb-6">
            QuickChat
          </h1>

          {users.map((user, index) => (

            <div
              key={index}
              onClick={() => setSelectedUser(user.name)}

              className={`p-3 rounded-lg mb-3 flex items-center gap-3 cursor-pointer transition ${
                selectedUser === user.name
                  ? "bg-indigo-400"
                  : "bg-indigo-500"
              }`}
            >

              <div className="w-10 h-10 rounded-full bg-white text-indigo-600 flex items-center justify-center font-bold">
                {user.name.charAt(0)}
              </div>

              <div>
                <h2 className="font-semibold">
                  {user.name}
                </h2>

                <p className="text-sm text-gray-200">
                  {user.status}
                </p>
              </div>

            </div>

          ))}

        </div>

        {/* Chat Area */}
        <div className="w-full md:w-[70%] flex flex-col">

          {/* Top Bar */}
          <div className="bg-white p-5 border-b text-xl font-semibold shadow-sm">
            {selectedUser}
          </div>

          {/* Messages */}
          <div className="flex-1 p-5 space-y-4 overflow-y-auto bg-gray-50">

            {allChats[selectedUser].map((msg, index) => (

              <div
                key={index}

                className={`p-3 rounded-2xl w-fit max-w-[80%] shadow ${
                  index % 2 === 0
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-300 ml-auto"
                }`}
              >
                {msg}
              </div>

            ))}

            <div ref={chatEndRef}></div>

          </div>

          {/* Input */}
          <div className="p-4 border-t flex gap-3 bg-white">

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

              className="flex-1 border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-400"
            />

            <button
              onClick={sendMessage}

              className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl transition"
            >
              Send
            </button>

          </div>

        </div>

      </div>

    </div>
  )
}

export default App