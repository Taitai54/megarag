import Link from 'next/link';
import { FileText, MessageSquare, Zap, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-5xl font-bold tracking-tight mb-6">
            MegaRAG
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            A comprehensive RAG system that handles all file types with knowledge graph indexing.
            Upload documents, videos, audio, and images - then chat with your knowledge base.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/dashboard">
              <Button size="lg">
                <FileText className="mr-2 h-5 w-5" />
                Go to Dashboard
              </Button>
            </Link>
            <Link href="/dashboard/chat">
              <Button size="lg" variant="outline">
                <MessageSquare className="mr-2 h-5 w-5" />
                Start Chatting
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <Card>
            <CardHeader>
              <FileText className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Multi-Format Support</CardTitle>
              <CardDescription>
                Upload PDFs, Word docs, PowerPoints, Excel files, images, videos, and audio files
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Supports PDF, DOCX, PPTX, XLSX, TXT, MD, MP4, MP3, WAV, JPG, PNG, GIF, and WebP formats.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Database className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Knowledge Graph</CardTitle>
              <CardDescription>
                Automatically extracts entities and relationships from your documents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Uses Gemini to identify people, organizations, locations, events, and their connections.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Zap className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Smart Retrieval</CardTitle>
              <CardDescription>
                Multiple query modes for different types of questions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Choose from naive, local, global, hybrid, or mix modes for optimal results.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tech Stack */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Built With</h2>
          <p className="text-muted-foreground">
            Next.js 14 • Supabase + pgvector • Gemini 2.0 Flash • Tailwind CSS
          </p>
        </div>
      </div>
    </div>
  );
}
