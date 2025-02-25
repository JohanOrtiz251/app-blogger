"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RssFeedManager } from "./rss-feed-manager"
import { ContentQueue } from "./content-queue"
import { PublishingStatus } from "./publishing-status"
import { Header } from "./header"

export function Dashboard() {
  return (
    <div className="container mx-auto py-6 space-y-8">
      <Header />
      <Tabs defaultValue="feeds" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="feeds">Feeds RSS</TabsTrigger>
          <TabsTrigger value="queue">Cola de Contenido</TabsTrigger>
          <TabsTrigger value="status">Estado de Publicación</TabsTrigger>
        </TabsList>
        <TabsContent value="feeds" className="space-y-4">
          <RssFeedManager />
        </TabsContent>
        <TabsContent value="queue" className="space-y-4">
          <ContentQueue />
        </TabsContent>
        <TabsContent value="status" className="space-y-4">
          <PublishingStatus />
        </TabsContent>
      </Tabs>
    </div>
  )
}
