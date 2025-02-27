"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Send, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

export default function Home() {
  const [message, setMessage] = useState<null | string>("")
  const [history, setHistory] = useState<string[]>([])
  const [ws, setWs] = useState<null | WebSocket>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const socket = new WebSocket("wss://chatapp-production-ccc7.up.railway.app")
    setWs(socket)

    socket.onopen = () => {
      console.log("✅ Connected to WebSocket")
      setIsConnected(true)
    }

    socket.onmessage = (e) => {
      console.log("📩 Received:", e.data)
      setHistory((prev) => [...prev, e.data])
    }

    socket.onclose = () => {
      setIsConnected(false)
    }

    return () => {
      socket.close()
    }
  }, [])

  const handleSendMessage = () => {
    if (message && ws) {
      ws.send(message)
      setMessage("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage()
    }
  }

  if (!ws) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-indigo-100 p-6">
        <Card className="w-full max-w-md shadow-xl">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center p-8">
              <Loader2 className="h-12 w-12 text-blue-500 animate-spin mb-4" />
              <h2 className="text-xl font-semibold text-gray-800">Connecting to chat...</h2>
              <p className="text-gray-500 mt-2">Please wait while we establish a connection</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-indigo-100 p-6">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="pb-3 border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold">
              <span className="flex items-center gap-2">
                <span className="text-2xl">💬</span> WebSocket Chat
              </span>
            </CardTitle>
            <Badge variant={isConnected ? "success" : "destructive"} className="px-2 py-1">
              {isConnected ? "Connected" : "Disconnected"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[400px] p-4">
            {history.length > 0 ? (
              <div className="space-y-3 pt-2">
                {history.map((msg, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md max-w-[85%] ml-auto transform transition-all duration-200 hover:scale-[1.02]"
                  >
                    {msg}
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                  <Send className="h-6 w-6 text-blue-500" />
                </div>
                <h3 className="text-lg font-medium text-gray-800">No messages yet</h3>
                <p className="text-gray-500 mt-1">Send a message to start chatting</p>
              </div>
            )}
          </ScrollArea>
          <div className="p-4 border-t bg-gray-50 rounded-b-lg">
            <div className="flex gap-2">
              <Input
                type="text"
                className="w-full text-gray-800 focus:ring-2 focus:ring-blue-500"
                placeholder="Type a message..."
                value={message || ""}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <Button onClick={handleSendMessage} className="bg-blue-600 hover:bg-blue-700">
                <Send className="h-4 w-4 mr-2" />
                Send
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

