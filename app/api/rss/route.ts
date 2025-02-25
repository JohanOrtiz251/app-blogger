import Parser from "rss-parser"
import { NextResponse } from "next/server"

const parser = new Parser()

export async function POST(req: Request) {
  try {
    const { url } = await req.json();
    const feed = await parser.parseURL(url);

    return NextResponse.json({
      title: feed.title,
      items: feed.items.map(item => ({
        title: item.title,
        content: item.content,
        link: item.link,
        pubDate: item.pubDate,
      })),
    });
  } catch (error) {
    console.error('Error fetching RSS feed:', error);
    return NextResponse.json(
      { error: 'Failed to fetch RSS feed' },
      { status: 500 }
    );
  }
}

