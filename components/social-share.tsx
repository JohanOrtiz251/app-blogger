"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Share2 } from "lucide-react"
import type { Article } from "@/lib/types"

interface SocialShareProps {
  article: Article
  bloggerUrl: string
}

export function SocialShare({ article, bloggerUrl }: SocialShareProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [socialContent, setSocialContent] = useState({
    facebook: "",
    twitter: "",
    linkedin: "",
  })
  const { toast } = useToast()

  const generateSocialContent = async (platform: keyof typeof socialContent) => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/ai/social", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: article.title,
          content: article.content,
          platform,
        }),
      })

      const data = await response.json()

      if (!response.ok) throw new Error(data.error)

      setSocialContent((prev) => ({
        ...prev,
        [platform]: data.content,
      }))

      toast({
        title: "Contenido generado",
        description: `Se ha generado el contenido para ${platform}`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo generar el contenido social",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const shareToSocial = async (platform: string) => {
    // Aquí iría la integración real con las APIs de redes sociales
    toast({
      title: "Compartido",
      description: `Contenido compartido en ${platform}`,
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Share2 className="h-4 w-4 mr-2" />
          Compartir en Redes
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Compartir en Redes Sociales</DialogTitle>
          <DialogDescription>Genera y personaliza el contenido para cada red social</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Facebook</h3>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => generateSocialContent("facebook")}
                  disabled={isLoading}
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Generar"}
                </Button>
                <Button size="sm" onClick={() => shareToSocial("facebook")} disabled={!socialContent.facebook}>
                  Compartir
                </Button>
              </div>
            </div>
            <Textarea
              value={socialContent.facebook}
              onChange={(e) =>
                setSocialContent((prev) => ({
                  ...prev,
                  facebook: e.target.value,
                }))
              }
              placeholder="Contenido para Facebook..."
            />
          </div>

          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Twitter</h3>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => generateSocialContent("twitter")}
                  disabled={isLoading}
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Generar"}
                </Button>
                <Button size="sm" onClick={() => shareToSocial("twitter")} disabled={!socialContent.twitter}>
                  Compartir
                </Button>
              </div>
            </div>
            <Textarea
              value={socialContent.twitter}
              onChange={(e) =>
                setSocialContent((prev) => ({
                  ...prev,
                  twitter: e.target.value,
                }))
              }
              placeholder="Contenido para Twitter..."
            />
          </div>

          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">LinkedIn</h3>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => generateSocialContent("linkedin")}
                  disabled={isLoading}
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Generar"}
                </Button>
                <Button size="sm" onClick={() => shareToSocial("linkedin")} disabled={!socialContent.linkedin}>
                  Compartir
                </Button>
              </div>
            </div>
            <Textarea
              value={socialContent.linkedin}
              onChange={(e) =>
                setSocialContent((prev) => ({
                  ...prev,
                  linkedin: e.target.value,
                }))
              }
              placeholder="Contenido para LinkedIn..."
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => setIsOpen(false)}>Cerrar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

