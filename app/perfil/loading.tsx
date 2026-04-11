import { Card, CardContent } from "@/components/ui/card";

export default function ProfileLoading() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
       <Card className="border-neon-blue/20 bg-background/95 backdrop-blur-md">
          <CardContent className="p-12 text-center flex flex-col items-center gap-4">
            <div className="h-12 w-12 rounded-full border-4 border-neon-blue border-t-transparent animate-spin mb-4" />
            <p className="text-muted-foreground animate-pulse font-orbitron">
              Sincronizando Búnker Industrial...
            </p>
            <p className="text-xs text-muted-foreground/50">
              Beatriz está preparando tu vista de éxito.
            </p>
          </CardContent>
        </Card>
    </div>
  );
}
