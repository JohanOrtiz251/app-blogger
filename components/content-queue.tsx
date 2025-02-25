"use client";

import { CardFooter } from "@/components/ui/card";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, RefreshCw, Wand2, Send } from "lucide-react";
import { useStore } from "@/lib/store";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function ContentQueue() {
  const { feeds, articles, addArticles, updateArticle, clearArticlesForFeed } = useStore();
  const [selectedFeed, setSelectedFeed] = useState<string>("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

  const refreshContent = async (feedId: string) => {
    const feed = feeds.find((f) => f.id === feedId);
    if (!feed) return;

    setIsRefreshing(true);
    try {
      const response = await fetch("/api/rss/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: feed.url }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      clearArticlesForFeed(feedId);

      const newArticles = data.items.map((item: any) => ({
        id: Date.now().toString() + Math.random(),
        title: item.title,
        content: item.content,
        originalContent: item.content,
        source: feed.title || feed.url,
        feedId: feed.id,
        status: "pendiente" as const,

      }));

      addArticles(newArticles);
      toast({ title: "Contenido actualizado", description: "Se han obtenido nuevos artículos del feed RSS." });
    } catch (error) {
      toast({ title: "Error al actualizar", description: "No se pudieron obtener nuevos artículos.", variant: "destructive" });
    } finally {
      setIsRefreshing(false);
    }
  };

  const processWithAI = async (article: (typeof articles)[0]) => {
    updateArticle(article.id, { status: "procesando" });

    try {
      const response = await fetch("/api/ai/rewrite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: article.content }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      updateArticle(article.id, { content: data.rewrittenContent, status: "listo" });

      toast({ title: "Contenido procesado", description: "El artículo ha sido reescrito exitosamente." });
    } catch (error) {
      toast({ title: "Error al procesar", description: "No se pudo reescribir el artículo.", variant: "destructive" });

      updateArticle(article.id, { status: "pendiente" });
    }
  };

  const publishArticle = async (article: (typeof articles)[0]) => {
    updateArticle(article.id, { status: "publicando" });

    try {
      const response = await fetch("/api/blogger/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: article.title, content: article.content }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      updateArticle(article.id, {
        status: "publicado",
        publishedUrl: data.url,
        publishedDate: new Date().toISOString(),
        imageUrl: data.imageUrl || null
      });

      toast({ title: "Artículo publicado", description: "El artículo ha sido publicado exitosamente." });
    } catch (error) {
      toast({ title: "Error al publicar", description: "No se pudo publicar el artículo.", variant: "destructive" });

      updateArticle(article.id, { status: "listo" });
    }
  };

  const filteredArticles = selectedFeed ? articles.filter((article) => article.feedId === selectedFeed) : articles;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Cola de Contenido</h2>
        <div className="flex gap-4">
          <Select value={selectedFeed} onValueChange={setSelectedFeed}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Seleccionar feed" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los feeds</SelectItem>
              {feeds.map((feed) => (
                <SelectItem key={feed.id} value={feed.id}>
                  {feed.title || feed.url}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={() => selectedFeed && refreshContent(selectedFeed)} disabled={isRefreshing || !selectedFeed}>
            {isRefreshing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <RefreshCw className="h-4 w-4 mr-2" />}
            Actualizar Contenido
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {filteredArticles.map((article) => (
          <Card key={article.id}>
            <CardHeader>
              <CardTitle>{article.title}</CardTitle>
              <CardDescription>Fuente: {article.source}</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea className="min-h-[200px]" value={article.content} readOnly />
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => {
                  if (article.originalContent) {
                    updateArticle(article.id, { content: article.originalContent, status: "pendiente" });
                  }
                }}
              >
                Restaurar Original
              </Button>
              <div className="flex gap-2">
                <Button onClick={() => processWithAI(article)} disabled={article.status === "procesando"}>
                  {article.status === "procesando" ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Wand2 className="h-4 w-4 mr-2" />}
                  Procesar con IA
                </Button>
                {article.status === "listo" && (
                  <Button variant="default" onClick={() => publishArticle(article)}>
                    <Send className="h-4 w-4 mr-2" />
                    Publicar
                  </Button>
                )}
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
