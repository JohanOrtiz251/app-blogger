"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useStore } from "@/lib/store"

export function PublishingStatus() {
  const { articles } = useStore()
  const publishedArticles = articles.filter((article) => article.status === "publicado")

  // Definir los tipos de estado permitidos
  type StatusType = "pendiente" | "procesando" | "listo" | "publicado"

  // Asignar solo los valores válidos aceptados por <Badge>
  const variants: Record<StatusType, "secondary" | "default" | "destructive" | "outline"> = {
    pendiente: "default",
    procesando: "secondary",
    listo: "outline",
    publicado: "destructive", // Puedes cambiarlo si destructivo no es adecuado
  }

  const getStatusBadge = (status: StatusType) => {
    return <Badge variant={variants[status]}>{status}</Badge>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Historial de Publicaciones</CardTitle>
        <CardDescription>Seguimiento del estado de tu contenido en diferentes plataformas</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Fuente</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Fecha de Publicación</TableHead>
              <TableHead>URL</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {publishedArticles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  No hay publicaciones realizadas
                </TableCell>
              </TableRow>
            ) : (
              publishedArticles.map((article) => (
                <TableRow key={article.id}>
                  <TableCell>{article.title}</TableCell>
                  <TableCell>{article.source}</TableCell>
                  <TableCell>{getStatusBadge(article.status as StatusType)}</TableCell>
                  <TableCell>{article.publishedDate && new Date(article.publishedDate).toLocaleString()}</TableCell>
                  <TableCell>
                    {article.publishedUrl && (
                      <a
                        href={article.publishedUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        Ver
                      </a>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
