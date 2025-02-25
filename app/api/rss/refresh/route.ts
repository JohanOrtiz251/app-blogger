import Parser from "rss-parser"
import { NextResponse } from "next/server"

const parser = new Parser({
  customFields: {
    item: [
      ["media:content", "media"],
      ["content:encoded", "contentEncoded"],
    ],
  },
})

export async function POST(req: Request) {
  try {
    const { url } = await req.json()
    const feed = await parser.parseURL(url)

    const items = feed.items.map((item) => ({
      title: item.title,
      content: item.contentEncoded || item.content,
      link: item.link,
      pubDate: item.pubDate,
      media: item.media,
    }))

    return NextResponse.json({ items })
} catch (error) {
  console.error("Error al actualizar el feed:", error);
  return NextResponse.json({ error: "Error al actualizar el feed" }, { status: 500 });
}
}

