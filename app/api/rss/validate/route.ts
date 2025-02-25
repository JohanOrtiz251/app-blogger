import Parser from "rss-parser"
import { NextResponse } from "next/server"

const parser = new Parser()

export async function POST(req: Request) {
  try {
    const { url } = await req.json()
    const feed = await parser.parseURL(url)

    return NextResponse.json({
      title: feed.title,
      description: feed.description,
      link: feed.link,
    })
} catch (error) {
  console.error("Error al validar el feed RSS:", error);
  return NextResponse.json({ error: "Feed RSS inválido o inaccesible" }, { status: 400 });
}
}

