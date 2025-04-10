import { Card, CardContent } from "@/components/ui/card";
import { Home, AlertTriangle, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
      <Card className="w-full max-w-md mx-4 border-2 border-blue-200 shadow-lg">
        <CardContent className="pt-6 pb-8">
          <div className="flex flex-col items-center mb-6 text-center">
            <div className="h-20 w-20 rounded-full bg-blue-100 flex items-center justify-center mb-4">
              <AlertTriangle className="h-10 w-10 text-blue-600" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-blue-800 mb-2">Página no encontrada</h1>
            <p className="text-gray-600">
              Lo sentimos, la página que estás buscando no existe o ha sido trasladada.
            </p>
          </div>

          <div className="space-y-3 mt-8">
            <Button asChild variant="default" className="w-full bg-blue-600 hover:bg-blue-700">
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Ir a la página principal
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="w-full border-blue-200">
              <a onClick={() => window.history.back()}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver a la página anterior
              </a>
            </Button>
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              ¿Necesitas ayuda con la valoración de tu propiedad?
              <br />
              Llámanos al <a href="tel:+34622337098" className="text-blue-600 font-medium">+34 622 337 098</a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
