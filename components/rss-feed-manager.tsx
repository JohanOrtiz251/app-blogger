"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Plus, Trash2, RefreshCw } from "lucide-react"
import { useStore } from "@/lib/store"
import type { Feed } from "@/lib/types" // Asegúrate de importar el tipo desde el archivo correcto


export function RssFeedManager() {
  const { feeds, addFeed: addFeedToStore, removeFeed: removeFeedFromStore, updateFeedLastFetched } = useStore()
  const [newFeedUrl, setNewFeedUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const validateFeed = async (url: string) => {
    try {
      const response = await fetch("/api/rss/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      })

      if (!response.ok) throw new Error("Feed inválido")

      const data = await response.json()
      return data
    } catch (error) {
      throw new Error("No se pudo validar el feed")
    }
  }

  const addFeed = async () => {
    if (!newFeedUrl) return

    setIsLoading(true)
    try {
      const feedData = await validateFeed(newFeedUrl)
      const newFeed: Feed = {
        id: Date.now().toString(),
        url: newFeedUrl,
        lastFetched: new Date().toISOString(),
        title: feedData.title,
      }
      addFeedToStore(newFeed)
      setNewFeedUrl("")
      toast({
        title: "Feed añadido correctamente",
        description: "El feed RSS ha sido añadido a tus fuentes.",
      })
    } catch (error) {
      toast({
        title: "Error al añadir el feed",
        description: "Por favor verifica la URL e intenta nuevamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await addFeed()
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Añadir Nuevo Feed RSS</CardTitle>
          <CardDescription>Ingresa la URL del feed RSS que deseas monitorear</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex gap-4">
            <Input
              placeholder="https://ejemplo.com/feed.xml"
              value={newFeedUrl}
              onChange={(e) => setNewFeedUrl(e.target.value)}
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
              Añadir Feed
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {feeds.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              No hay feeds RSS añadidos. Añade uno usando el formulario de arriba.
            </CardContent>
          </Card>
        ) : (
          feeds.map((feed) => (
            <Card key={feed.id}>
              <CardHeader>
                <CardTitle className="text-base">{feed.title || feed.url}</CardTitle>
                <CardDescription>Última actualización: {new Date(feed.lastFetched).toLocaleString()}</CardDescription>
              </CardHeader>
              <CardFooter className="flex justify-between">
                <Button variant="destructive" size="sm" onClick={() => removeFeedFromStore(feed.id)}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Eliminar Feed
                </Button>
                <Button variant="outline" size="sm" onClick={() => updateFeedLastFetched(feed.id)}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Actualizar
                </Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

