"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useStore } from "@/lib/store";

// Definir los tipos de estado permitidos
type StatusType = "pendiente" | "procesando" | "listo" | "publicado" | "publicando";

// Asignar variantes de Badge según el estado
const variants: Record<StatusType, "secondary" | "default" | "destructive" | "outline"> = {
  pendiente: "default",
  procesando: "secondary",
  publicando: "secondary", // Se usa igual que "procesando"
  listo: "outline",
  publicado: "destructive", // Cambia si necesitas otro estilo
};

// Función para formatear el texto con mayúscula inicial
const capitalizeFirstLetter = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

export function PublishingStatus() {
  const { articles } = useStore();
  const publishedArticles = articles.filter((article) => article.status === "publicado");

  const getStatusBadge = (status: StatusType) => {
    return <Badge variant={variants[status]}>{capitalizeFirstLetter(status)}</Badge>;
  };

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
                  <TableCell>{article.publishedDate ? new Date(article.publishedDate).toLocaleString() : "N/A"}</TableCell>
                  <TableCell>
                    {article.publishedUrl ? (
                      <a href={article.publishedUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                        Ver
                      </a>
                    ) : (
                      "N/A"
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
