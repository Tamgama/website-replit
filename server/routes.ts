import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { WebSocketServer } from "ws";
import { insertPropertySchema, insertUserSchema } from "@shared/schema";
import { obtenerDatosInmueblePorCoordenadas, obtenerDetalleInmueble, registerCatastroListEndpoints, registerCatastroBusquedaEndpoint, obtenerReferenciaCatastralPorCoordenadas } from "./catastro";
import { requestAerialView } from "./aerial-view";

// Contact form schema
const contactFormSchema = z.object({
  name: z.string().min(2),
  phone: z.string().min(9),
  location: z.string().min(2),
  message: z.string().min(10),
  privacy: z.boolean().refine(val => val === true),
});

// Login schema
const loginSchema = z.object({
  phone: z.string().min(9, { message: "El número de teléfono debe tener al menos 9 dígitos" }),
  password: z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres" }),
});

// Register schema with extended fields
const registerSchema = loginSchema.extend({
  name: z.string().optional(),
  email: z.string().email().optional(),
  role: z.enum(["propietario", "agencia"]).default("propietario"),
});

// Property schema
const propertySchema = z.object({
  user_id: z.number(),
  title: z.string().min(5),
  address: z.string().min(5),
  location: z.string().min(2),
  size: z.number().min(20),
  rooms: z.number().optional(),
  bathrooms: z.number().optional(),
  price: z.number().optional(),
  description: z.string().optional(),
  sale_type: z.string().min(2),
});

// Update property schema
const updatePropertySchema = z.object({
  status: z.string().min(2),
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Contact form endpoint
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = contactFormSchema.parse(req.body);
      
      // In a real implementation, you'd store this in a database or send it via email
      console.log("Contact form submission:", validatedData);
      
      res.status(200).json({ success: true, message: "Mensaje recibido correctamente" });
    } catch (error) {
      res.status(400).json({ success: false, message: "Datos no válidos" });
    }
  });

  // Register endpoint
  app.post("/api/register", async (req, res) => {
    try {
      const userData = registerSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByPhone(userData.phone);
      if (existingUser) {
        return res.status(400).json({ 
          success: false, 
          message: "Ya existe un usuario con este número de teléfono" 
        });
      }
      
      // Create new user
      const user = await storage.createUser(userData);
      
      // Return user data without sensitive info
      return res.status(201).json({ 
        success: true, 
        message: "Usuario registrado correctamente",
        user: { 
          id: user.id, 
          phone: user.phone,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      return res.status(400).json({ 
        success: false, 
        message: "Datos no válidos",
        error: error instanceof Error ? error.message : "Error desconocido" 
      });
    }
  });

  // Login endpoint
  app.post("/api/login", async (req, res) => {
    try {
      const { phone, password } = loginSchema.parse(req.body);
      
      const user = await storage.getUserByPhone(phone);
      
      // If user doesn't exist
      if (!user) {
        return res.status(401).json({ 
          success: false, 
          message: "No existe ningún usuario con este número de teléfono" 
        });
      }
      
      // Check password (in a real app, would use bcrypt or similar)
      const isPasswordValid = user.password === password;
      
      if (isPasswordValid) {
        // In a real app, we would set session/JWT here
        
        return res.status(200).json({ 
          success: true, 
          message: "Login exitoso",
          user: { 
            id: user.id, 
            phone: user.phone,
            name: user.name,
            email: user.email,
            role: user.role,
            lastValuation: user.last_valuation 
          }
        });
      } else {
        return res.status(401).json({ 
          success: false, 
          message: "Contraseña incorrecta" 
        });
      }
    } catch (error) {
      return res.status(400).json({ 
        success: false, 
        message: "Datos no válidos" 
      });
    }
  });
  
  // Get current logged in user
  app.get("/api/me", async (req, res) => {
    try {
      // En una aplicación real, obtendríamos el usuario desde la sesión o token JWT
      // Para esta demo, vamos a crear usuarios de prueba si no existe ninguno
      
      // Verificar si hay usuarios registrados
      const users = await storage.getAllUsers();
      
      // Si no hay usuarios, crear usuarios de demostración
      if (!users || users.length === 0) {
        // Crear usuario propietario de demo
        const demoOwner = await storage.createUser({ 
          phone: "666777888", 
          password: "123456",
          name: "Juan Propietario",
          role: "propietario"
        });
        
        // Crear usuario agencia de demo
        const demoAgency = await storage.createUser({
          phone: "999888777",
          password: "123456",
          name: "Inmobiliaria Murcia",
          role: "agencia"
        });
        
        // Para la demo, devolvemos el usuario propietario
        return res.status(200).json({
          success: true,
          user: {
            id: demoOwner.id,
            phone: demoOwner.phone,
            name: demoOwner.name,
            role: demoOwner.role,
            lastValuation: demoOwner.last_valuation
          }
        });
      }
      
      // En una aplicación real, usaríamos el usuario autenticado
      // Para la demo, usamos el primer usuario (propietario por defecto)
      const user = users[0];
      
      return res.status(200).json({
        success: true,
        user: {
          id: user.id,
          phone: user.phone,
          name: user.name,
          role: user.role,
          lastValuation: user.last_valuation
        }
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error al obtener usuario"
      });
    }
  });
  
  // Endpoint for creating a property
  app.post("/api/properties", async (req, res) => {
    try {
      const propertyData = propertySchema.parse(req.body);
      
      // En una aplicación real, verificaríamos que el usuario está autenticado
      // y que userId corresponde al usuario autenticado o es una agencia
      
      const newProperty = await storage.createProperty(propertyData);
      
      // Notificar a todos los clientes conectados por WebSocket
      notifyAllClients({
        type: 'new_property',
        property: {
          id: newProperty.id,
          title: newProperty.title,
          location: newProperty.location,
          sale_type: newProperty.sale_type
        }
      });
      
      return res.status(201).json({
        success: true,
        message: "Propiedad creada correctamente",
        property: newProperty
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: "Datos no válidos",
        error: error instanceof Error ? error.message : "Error desconocido"
      });
    }
  });
  
  // Endpoint for updating property status
  app.patch("/api/properties/:id/status", async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = updatePropertySchema.parse(req.body);
      
      // En una aplicación real, verificaríamos permisos del usuario
      
      const updatedProperty = await storage.updatePropertyStatus(Number(id), status);
      
      if (!updatedProperty) {
        return res.status(404).json({
          success: false,
          message: "Propiedad no encontrada"
        });
      }
      
      // Notificar a todos los clientes conectados por WebSocket
      notifyAllClients({
        type: 'property_updated',
        property: {
          id: updatedProperty.id,
          title: updatedProperty.title,
          status: updatedProperty.status
        }
      });
      
      return res.status(200).json({
        success: true,
        message: "Estado de la propiedad actualizado correctamente",
        property: updatedProperty
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: "Datos no válidos",
        error: error instanceof Error ? error.message : "Error desconocido"
      });
    }
  });
  
  // Get all properties (with role check)
  app.get("/api/properties", async (req, res) => {
    try {
      // En una aplicación real, verificaríamos el rol del usuario
      // Para esta demo, obtenemos todas las propiedades
      const properties = await storage.getAllPropertiesWithOwners();
      
      return res.status(200).json({
        success: true,
        properties
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error al obtener propiedades"
      });
    }
  });
  
  // Get user properties
  app.get("/api/users/:id/properties", async (req, res) => {
    try {
      const { id } = req.params;
      
      // En una aplicación real, verificaríamos permisos
      
      const properties = await storage.getPropertiesByUserId(Number(id));
      
      return res.status(200).json({
        success: true,
        properties
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error al obtener propiedades del usuario"
      });
    }
  });
  
  // Get secret properties (updated to use database)
  app.get("/api/secret-properties", async (req, res) => {
    try {
      // En una aplicación real, verificaríamos que el usuario está autenticado
      const isAuthenticated = true; // Solo para demo
      
      if (!isAuthenticated) {
        return res.status(401).json({
          success: false,
          message: "No autenticado"
        });
      }
      
      // Intentar obtener propiedades de la base de datos
      const dbProperties = await storage.getAllProperties();
      
      // Si hay propiedades en la base de datos, las usamos
      if (dbProperties && dbProperties.length > 0) {
        const formattedProperties = dbProperties.map(prop => ({
          id: prop.id,
          title: prop.title,
          location: prop.location,
          price: prop.price,
          discount: 10, // Valor por defecto
          size: prop.size,
          description: prop.description,
          isExclusive: prop.sale_type === "secreta"
        }));
        
        return res.status(200).json(formattedProperties);
      }
      
      // Si no hay propiedades en la base de datos, usamos datos de demostración
      const secretProperties = [
        {
          id: 1,
          title: "Exclusiva Villa en Vista Alegre",
          location: "Vista Alegre, Murcia",
          price: 350000,
          discount: 15,
          size: 180,
          description: "Impresionante villa en una de las mejores zonas de Vista Alegre con jardín privado y piscina. Venta discreta sin publicidad externa.",
          isExclusive: true
        },
        {
          id: 2,
          title: "Ático de Lujo en La Flota",
          location: "La Flota, Murcia",
          price: 275000,
          discount: 10,
          size: 120,
          description: "Ático con terraza panorámica y las mejores vistas de la ciudad. No aparecerá en portales inmobiliarios.",
          isExclusive: false
        },
        {
          id: 3,
          title: "Chalet Adosado en Santa María de Gracia",
          location: "Santa María de Gracia, Murcia",
          price: 320000,
          discount: 12,
          size: 160,
          description: "Moderna vivienda adosada con amplio jardín y garaje para 2 coches. Oportunidad exclusiva para clientes registrados.",
          isExclusive: true
        }
      ];
      
      return res.status(200).json(secretProperties);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error al obtener propiedades secretas"
      });
    }
  });

  // Protected route for updating user valuations
  app.post("/api/valuation", async (req, res) => {
    try {
      // In a real app, we would verify user's session/token
      const { userId, valuationData } = req.body;
      
      if (!userId || !valuationData) {
        return res.status(400).json({ 
          success: false, 
          message: "Faltan datos requeridos" 
        });
      }
      
      const updatedUser = await storage.updateUserValuation(
        Number(userId), 
        JSON.stringify(valuationData)
      );
      
      if (!updatedUser) {
        return res.status(404).json({ 
          success: false, 
          message: "Usuario no encontrado" 
        });
      }
      
      // Notificar a todos los clientes conectados por WebSocket
      notifyAllClients({
        type: 'new_valuation',
        user: {
          id: updatedUser.id,
          name: updatedUser.name || "Usuario",
          phone: updatedUser.phone
        },
        valuation: valuationData
      });
      
      return res.status(200).json({ 
        success: true, 
        message: "Valoración guardada correctamente",
        lastValuation: updatedUser.last_valuation
      });
    } catch (error) {
      return res.status(500).json({ 
        success: false, 
        message: "Error al guardar la valoración" 
      });
    }
  });

  // Get all valuations (for agency dashboard)
  app.get("/api/valuations", async (req, res) => {
    try {
      // En una aplicación real, verificaríamos el rol del usuario (debe ser agencia)
      
      const users = await storage.getAllUsers();
      
      // Extraemos las valoraciones de todos los usuarios
      const valuations = users.map(user => ({
        userId: user.id,
        phone: user.phone,
        name: user.name || "",
        role: user.role,
        lastValuation: user.last_valuation,
        createdAt: user.created_at
      }));
      
      return res.status(200).json({
        success: true,
        valuations
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error al obtener valoraciones"
      });
    }
  });

  // Endpoint para consultar información catastral a partir de coordenadas
  app.get("/api/catastro/coordinates", async (req, res) => {
    try {
      const { lat, lng } = req.query;
      
      if (!lat || !lng) {
        return res.status(400).json({
          success: false,
          message: "Se requieren las coordenadas (lat, lng)"
        });
      }
      
      const datos = await obtenerDatosInmueblePorCoordenadas(Number(lat), Number(lng));
      
      if (datos.error) {
        return res.status(404).json({
          success: false,
          message: datos.error
        });
      }
      
      return res.status(200).json({
        success: true,
        data: datos
      });
    } catch (error) {
      console.error('Error al consultar catastro por coordenadas:', error);
      return res.status(500).json({
        success: false,
        message: "Error al consultar información catastral",
        error: error instanceof Error ? error.message : "Error desconocido"
      });
    }
  });
  
  // Endpoint para obtener propiedades y datos catastrales detallados
  app.get("/api/catastro/propiedades", async (req, res) => {
    try {
      const { lat, lng } = req.query;
      
      if (!lat || !lng) {
        return res.status(400).json({
          success: false,
          message: "Se requieren las coordenadas (lat, lng)"
        });
      }
      
      const datos = await obtenerDatosInmueblePorCoordenadas(Number(lat), Number(lng));
      
      if (datos.error) {
        return res.status(404).json({
          success: false,
          message: datos.error
        });
      }
      
      // Devolver tanto la información de la parcela como las propiedades encontradas
      return res.status(200).json({
        success: true,
        parcela: datos,
        edificio: datos.building || null,
        propiedades: datos.propiedades || []
      });
    } catch (error) {
      console.error('Error al consultar propiedades en el catastro:', error);
      return res.status(500).json({
        success: false,
        message: "Error al consultar propiedades en el catastro",
        error: error instanceof Error ? error.message : "Error desconocido"
      });
    }
  });
  
  // Endpoint para la API de Google Aerial View
  app.get("/api/aerial-view", async (req, res) => {
    try {
      const { address } = req.query;
      
      if (!address) {
        return res.status(400).json({
          success: false,
          message: "Se requiere una dirección para obtener la vista aérea"
        });
      }
      
      const response = await requestAerialView({
        address: address as string,
      });
      
      return res.status(200).json(response);
    } catch (error) {
      console.error('Error al obtener vista aérea:', error);
      return res.status(500).json({
        success: false,
        message: "Error al obtener vista aérea",
        error: error instanceof Error ? error.message : "Error desconocido"
      });
    }
  });
  
  // API para gestionar videos personalizados para localizaciones específicas
  app.post("/api/custom-videos", (req, res) => {
    try {
      const { location, videoUrl } = req.body;
      
      if (!location || !videoUrl) {
        return res.status(400).json({
          success: false,
          message: "Se requieren location y videoUrl"
        });
      }
      
      // En una aplicación real, guardaríamos esta información en la base de datos
      // Para esta demo, simplemente confirmamos que recibimos los datos
      
      return res.status(200).json({
        success: true,
        message: `Video personalizado para ${location} configurado correctamente`,
        data: { location, videoUrl }
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error al configurar video personalizado",
        error: error instanceof Error ? error.message : "Error desconocido"
      });
    }
  });
  
  // Endpoint más genérico para consultas al catastro
  app.get("/api/catastro", async (req, res) => {
    try {
      const { lat, lng } = req.query;
      
      if (!lat || !lng) {
        return res.status(400).json({ 
          success: false, 
          message: "Se requieren parámetros 'lat' y 'lng'" 
        });
      }
      
      // Convertir a números
      const latNum = parseFloat(lat as string);
      const lngNum = parseFloat(lng as string);
      
      // Validar que sean números válidos
      if (isNaN(latNum) || isNaN(lngNum)) {
        return res.status(400).json({ 
          success: false, 
          message: "Los parámetros 'lat' y 'lng' deben ser números válidos" 
        });
      }
      
      // Obtener datos del catastro
      const catastroData = await obtenerDatosInmueblePorCoordenadas(latNum, lngNum);
      
      // Convertir la estructura de datos al formato que espera el cliente
      const responseData = {
        success: true,
        parcels: [{
          rc: catastroData.referenciaCatastral || "",
          area: catastroData.superficieConstruida || "90",
          address: catastroData.localizacion || "Dirección desconocida",
          buildingType: catastroData.claseUrbano || "Urbano"
        }],
        buildings: [{
          rc: catastroData.referenciaCatastral || "",
          area: catastroData.superficieConstruida || "90",
          constructionYear: catastroData.anoConstruccion || "",
          use: catastroData.usoPrincipal || "Residencial",
          floors: "1",
          condition: "Normal"
        }],
        // Añadir las propiedades directamente si están disponibles
        propiedades: catastroData.propiedades || []
      };
      
      res.json(responseData);
    } catch (error) {
      console.error('Error en endpoint /api/catastro:', error);
      res.status(500).json({ 
        success: false, 
        message: "Error al procesar la solicitud" 
      });
    }
  });

  // Endpoint para consultar información catastral por referencia catastral
  app.get("/api/catastro/refcat/:refcat", async (req, res) => {
    try {
      const { refcat } = req.params;
      
      if (!refcat) {
        return res.status(400).json({
          success: false,
          message: "Se requiere la referencia catastral"
        });
      }
      
      const datos = await obtenerDetalleInmueble(refcat);
      
      if (datos.error) {
        return res.status(404).json({
          success: false,
          message: datos.error
        });
      }
      
      return res.status(200).json({
        success: true,
        data: datos
      });
    } catch (error) {
      console.error('Error al consultar catastro por referencia:', error);
      return res.status(500).json({
        success: false,
        message: "Error al consultar información catastral",
        error: error instanceof Error ? error.message : "Error desconocido"
      });
    }
  });

  const httpServer = createServer(app);
  
  // Configurar WebSocket para actualizaciones en tiempo real
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  wss.on('connection', (ws) => {
    console.log('Client connected to WebSocket');
    
    // Enviar mensaje de bienvenida
    ws.send(JSON.stringify({ type: 'welcome', message: 'Conectado al servidor de Promurcia' }));
    
    ws.on('message', (message) => {
      console.log('Received message:', message.toString());
      
      // Aquí podríamos procesar mensajes específicos
      // Por ejemplo, un cliente podría solicitar suscribirse a actualizaciones de propiedades
    });
    
    ws.on('close', () => {
      console.log('Client disconnected from WebSocket');
    });
  });
  
  // Función para notificar a todos los clientes conectados
  const notifyAllClients = (data: any) => {
    const WebSocket = require('ws');
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  };
  
  // Endpoint para recibir la decisión del propietario sobre su propiedad
  app.post("/api/property-decision", async (req, res) => {
    try {
      const { userId, valuationData, option, message, action, timestamp } = req.body;
      
      if (!userId || !option) {
        return res.status(400).json({ 
          success: false, 
          message: "Faltan datos requeridos" 
        });
      }
      
      // Obtener datos del usuario
      const user = await storage.getUser(Number(userId));
      if (!user) {
        return res.status(404).json({ 
          success: false, 
          message: "Usuario no encontrado" 
        });
      }
      
      // Crear un objeto con la información de la decisión
      const decisionData = {
        userId,
        userName: user.name || "Propietario",
        phone: user.phone,
        valuationData,
        option,
        message,
        action,
        timestamp
      };
      
      // Notificar a todos los clientes conectados por WebSocket (agencias)
      // Este mensaje aparecerá en tiempo real en el panel de la agencia
      notifyAllClients({
        type: 'property_decision',
        decision: decisionData
      });
      
      return res.status(200).json({ 
        success: true, 
        message: "Decisión recibida correctamente"
      });
    } catch (error) {
      return res.status(500).json({ 
        success: false, 
        message: "Error al procesar la decisión" 
      });
    }
  });
  
  // Endpoint para obtener un usuario por teléfono
  app.get("/api/users/phone/:phone", async (req, res) => {
    try {
      const { phone } = req.params;
      
      const user = await storage.getUserByPhone(phone);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Usuario no encontrado"
        });
      }
      
      // Devolver datos del usuario sin información sensible
      return res.status(200).json({
        success: true,
        user: {
          id: user.id,
          phone: user.phone,
          name: user.name,
          role: user.role,
          lastValuation: user.last_valuation,
          createdAt: user.created_at
        }
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error al obtener datos del usuario"
      });
    }
  });
  
  // Endpoint para obtener datos de un usuario específico
  app.get("/api/users/:id", async (req, res) => {
    try {
      const { id } = req.params;
      
      const user = await storage.getUser(Number(id));
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Usuario no encontrado"
        });
      }
      
      // Devolver datos del usuario sin información sensible
      return res.status(200).json({
        success: true,
        user: {
          id: user.id,
          phone: user.phone,
          name: user.name,
          role: user.role,
          lastValuation: user.last_valuation,
          createdAt: user.created_at
        }
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error al obtener datos del usuario"
      });
    }
  });
  
  // Endpoint para actualizar la valoración de un usuario
  app.post("/api/users/:id/valuation", async (req, res) => {
    try {
      const { id } = req.params;
      const { valuationData } = req.body;
      
      if (!valuationData) {
        return res.status(400).json({
          success: false,
          message: "Datos de valoración no proporcionados"
        });
      }
      
      const updatedUser = await storage.updateUserValuation(Number(id), valuationData);
      
      if (!updatedUser) {
        return res.status(404).json({
          success: false,
          message: "Usuario no encontrado"
        });
      }
      
      // Notificar a todos los clientes conectados por WebSocket
      notifyAllClients({
        type: 'updated_valuation',
        user: {
          id: updatedUser.id,
          name: updatedUser.name || "Usuario",
          phone: updatedUser.phone
        }
      });
      
      return res.status(200).json({
        success: true,
        message: "Valoración actualizada correctamente",
        user: {
          id: updatedUser.id,
          phone: updatedUser.phone,
          name: updatedUser.name,
          role: updatedUser.role,
          lastValuation: updatedUser.last_valuation
        }
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error al actualizar la valoración"
      });
    }
  });

  registerCatastroBusquedaEndpoint(app);
  registerCatastroListEndpoints(app);

  // Exponer la función notifyAllClients para usarla en otras partes de la aplicación
  (app as any).notifyAllClients = notifyAllClients;

  return httpServer;
}

