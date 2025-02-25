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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Filter } from "lucide-react"
import { useStore } from "@/lib/store"
import { Badge } from "@/components/ui/badge"

export function FeedFilters() {
  const { filters, updateFilters } = useStore()
  const [newKeyword, setNewKeyword] = useState("")
  const [newCategory, setNewCategory] = useState("")
  const [minScore, setMinScore] = useState(filters.minRelevanceScore.toString())
  const [isOpen, setIsOpen] = useState(false)

  const addKeyword = () => {
    if (newKeyword && !filters.keywords.includes(newKeyword)) {
      updateFilters({
        ...filters,
        keywords: [...filters.keywords, newKeyword],
      })
      setNewKeyword("")
    }
  }

  const removeKeyword = (keyword: string) => {
    updateFilters({
      ...filters,
      keywords: filters.keywords.filter((k) => k !== keyword),
    })
  }

  const addCategory = () => {
    if (newCategory && !filters.categories.includes(newCategory)) {
      updateFilters({
        ...filters,
        categories: [...filters.categories, newCategory],
      })
      setNewCategory("")
    }
  }

  const removeCategory = (category: string) => {
    updateFilters({
      ...filters,
      categories: filters.categories.filter((c) => c !== category),
    })
  }

  const handleSave = () => {
    updateFilters({
      ...filters,
      minRelevanceScore: Number(minScore),
    })
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Configurar Filtros
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Criterios de Filtrado</DialogTitle>
          <DialogDescription>Configura los criterios para filtrar el contenido de los feeds RSS</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label>Palabras Clave</Label>
            <div className="flex gap-2">
              <Input
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                placeholder="Añadir palabra clave"
              />
              <Button type="button" onClick={addKeyword}>
                Añadir
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {filters.keywords.map((keyword) => (
                <Badge
                  key={keyword}
                  variant="secondary"
                  className="cursor-pointer"
                  onClick={() => removeKeyword(keyword)}
                >
                  {keyword} ×
                </Badge>
              ))}
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Categorías</Label>
            <div className="flex gap-2">
              <Input
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Añadir categoría"
              />
              <Button type="button" onClick={addCategory}>
                Añadir
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {filters.categories.map((category) => (
                <Badge
                  key={category}
                  variant="secondary"
                  className="cursor-pointer"
                  onClick={() => removeCategory(category)}
                >
                  {category} ×
                </Badge>
              ))}
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Puntuación Mínima de Relevancia (0-100)</Label>
            <Input type="number" min="0" max="100" value={minScore} onChange={(e) => setMinScore(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSave}>Guardar Filtros</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

