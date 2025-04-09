import { Link, useLocation } from "wouter";
import { useState } from "react";
import { Search, Home, Check, Eye, EyeOff } from "lucide-react";

// Enum para los pasos de valoración (reducido a 3)
enum ValuationStep {
  Address = 1,
  PropertyDetails = 2,
  Result = 3
}

const HeroSection = () => {
  const [currentStep, setCurrentStep] = useState<ValuationStep>(ValuationStep.Address);
  const [address, setAddress] = useState('');
  const [propertyData, setPropertyData] = useState({
    type: '',
    size: '',
    rooms: '',
    bathrooms: '',
    condition: '' // Ahora el estado forma parte del paso 2
  });
  const [userData, setUserData] = useState({
    name: '',
    phone: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({
    name: false,
    phone: false,
    password: false
  });
  const [, setLocation] = useLocation();
  
  // Función para validar dirección y avanzar al siguiente paso
  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (address.trim().length > 0) {
      // Almacenar la dirección y avanzar al siguiente paso
      localStorage.setItem('propertyAddress', address);
      
      // Avanzar al siguiente paso dentro del componente
      setCurrentStep(ValuationStep.PropertyDetails);
    } else {
      document.getElementById('address-error')?.setAttribute('style', 'display: block');
    }
  };
  
  // Función para manejar cambios en los campos del formulario de propiedad
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'address') {
      setAddress(value);
      // Ocultar mensaje de error cuando se empieza a escribir
      if (value.trim().length > 0) {
        document.getElementById('address-error')?.setAttribute('style', 'display: none');
      }
    } else {
      setPropertyData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  // Función para manejar cambios en los campos del formulario de usuario
  const handleUserInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Quitar el error si se empieza a escribir
    if (value.trim().length > 0) {
      setFormErrors(prev => ({
        ...prev,
        [name]: false
      }));
    }
  };
  
  // Función para continuar a la página de resultados
  const handleContinueToResults = () => {
    // Validar que todos los campos importantes estén completados
    if (!propertyData.type || !propertyData.size || !propertyData.rooms || !propertyData.condition) {
      alert('Por favor, completa todos los campos importantes para continuar.');
      return;
    }
    
    // Guardar todos los datos de la propiedad
    localStorage.setItem('propertyData', JSON.stringify(propertyData));
    
    // Avanzar al paso de resultados
    setCurrentStep(ValuationStep.Result);
  };
  
  // Función para registrar usuario y mostrar valoración
  const handleRegisterAndShowValuation = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar formulario
    const newErrors = {
      name: !userData.name.trim(),
      phone: !userData.phone.trim() || userData.phone.length < 9,
      password: !userData.password.trim() || userData.password.length < 6
    };
    
    setFormErrors(newErrors);
    
    // Si hay algún error, no continuar
    if (newErrors.name || newErrors.phone || newErrors.password) {
      return;
    }
    
    // Indicar que se está procesando
    setIsSubmitting(true);
    
    try {
      // Crear objeto con datos completos para la API
      const valuationData = {
        address,
        ...propertyData,
        estimatedValue: calculateEstimatedValue() // Esta función calcularía un valor aproximado
      };
      
      // Enviar datos al servidor para registrar usuario y guardar valoración
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: userData.name,
          phone: userData.phone,
          password: userData.password,
          role: 'propietario'
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Guardar el ID del usuario para usarlo en la página de resultado
        localStorage.setItem('userId', data.user.id);
        
        // Guardar la valoración después de registrar el usuario
        const valResponse = await fetch('/api/valuation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: data.user.id,
            valuationData: valuationData
          })
        });
        
        const valData = await valResponse.json();
        
        if (valData.success) {
          // Guardar datos para mostrar en la página de resultado
          localStorage.setItem('valuationData', JSON.stringify(valuationData));
          
          // Redireccionar al área de cliente (o página de resultado)
          setLocation('/area-cliente');
        } else {
          alert('Tu cuenta ha sido creada, pero hubo un problema al guardar la valoración.');
          setLocation('/area-cliente');
        }
      } else {
        // Mostrar error
        if (data.message && data.message.includes('Ya existe un usuario con este número de teléfono')) {
          setFormErrors(prev => ({ ...prev, phone: true }));
          const phoneErrorElement = document.getElementById('phone-error');
          if (phoneErrorElement) {
            phoneErrorElement.innerText = 'Este teléfono ya está registrado';
          }
        } else {
          alert(data.message || 'Error al registrar usuario');
        }
      }
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      alert('Ha ocurrido un error al procesar tu solicitud. Por favor, inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Función para calcular un valor estimado basado en los datos
  const calculateEstimatedValue = (): string => {
    // Implementación sencilla para calcular un precio aproximado en base a los datos
    const basePrice = 150000; // Precio base para Vista Alegre
    const typeMultiplier = propertyData.type === 'piso' ? 1 :
                          propertyData.type === 'atico' ? 1.4 :
                          propertyData.type === 'duplex' ? 1.3 :
                          propertyData.type === 'casa' ? 1.5 : 0.9;
    
    const sizeValue = propertyData.size ? parseInt(propertyData.size) * 1500 : 0;
    
    const roomsMultiplier = propertyData.rooms === '1' ? 0.9 :
                           propertyData.rooms === '2' ? 1 :
                           propertyData.rooms === '3' ? 1.1 :
                           propertyData.rooms === '4' ? 1.2 : 1.3;
    
    const conditionMultiplier = propertyData.condition === 'nuevo' ? 1.3 :
                               propertyData.condition === 'reformado' ? 1.2 :
                               propertyData.condition === 'bueno' ? 1 : 0.8;
    
    const estimatedValue = (basePrice + sizeValue) * typeMultiplier * roomsMultiplier * conditionMultiplier;
    
    // Redondear a miles
    const roundedValue = Math.round(estimatedValue / 1000) * 1000;
    
    return roundedValue.toLocaleString('es-ES') + ' €';
  };
  return (
    <section className="bg-white py-8 md:py-16">
      <div className="container mx-auto px-4">

        
        <div className="flex flex-col items-center">
          <div className="w-full max-w-xl mx-auto text-center">

            <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-3 text-blue-800">
              ¿Cuánto vale mi casa en <span className="text-blue-600 underline decoration-blue-500/30 decoration-4 underline-offset-2">Vista Alegre</span>?
            </h1>
            <p className="text-base md:text-xl mb-4 leading-relaxed text-gray-700">
              Valoración <span className="font-bold bg-yellow-100 px-1 rounded">100% GRATUITA</span> de viviendas online en <span className="font-semibold">solo 3 minutos</span>
            </p>
            <div className="mb-4 flex justify-center">
              <span className="inline-flex items-center bg-blue-50 text-blue-700 font-medium rounded-full px-4 py-1 text-sm">
                <svg viewBox="0 0 24 24" className="w-4 h-4 mr-1 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Solo 3 PASOS - 100% ONLINE
              </span>
            </div>
            
            {/* Formulario de valoración en 3 pasos */}
            <div className="max-w-md mx-auto mb-6">
              {/* Indicador de pasos */}
              <div className="flex justify-between items-center mb-4">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex flex-col items-center">
                    <div 
                      className={`flex items-center justify-center w-8 h-8 rounded-full border-2 
                        ${currentStep >= step 
                          ? "bg-blue-600 border-blue-600 text-white" 
                          : "bg-white border-gray-300 text-gray-400"}`}
                    >
                      {currentStep > step ? <Check className="w-4 h-4" /> : step}
                    </div>
                    <div className="text-xs mt-1 font-medium" style={{opacity: currentStep >= step ? 1 : 0.6}}>
                      {step === 1 ? "Dirección" : step === 2 ? "Detalles" : "Datos"}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Paso 1: Dirección */}
              {currentStep === ValuationStep.Address && (
                <div className="bg-white rounded-lg shadow-md p-4">
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                      <Search className="w-5 h-5 text-gray-400" />
                    </div>
                    <input 
                      type="text" 
                      name="address"
                      value={address}
                      onChange={handleInputChange}
                      className="w-full py-3 px-3 pl-10 border border-gray-300 rounded-md text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Introduce la dirección de tu propiedad..."
                    />
                  </div>
                  <div id="address-error" className="text-sm text-red-500 mt-1" style={{display: 'none'}}>
                    Por favor, introduce una dirección para continuar
                  </div>
                  <button 
                    onClick={handleAddressSubmit}
                    className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-md shadow-md transition-colors text-center"
                  >
                    Continuar
                  </button>
                </div>
              )}
              
              {/* Paso 2: Características */}
              {currentStep === ValuationStep.PropertyDetails && (
                <div className="bg-white rounded-lg shadow-md p-4">
                  <div className="text-sm text-gray-600 mb-3">
                    Dirección: <span className="font-semibold">{address}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tipo de inmueble
                      </label>
                      <select 
                        name="type"
                        value={propertyData.type}
                        onChange={handleInputChange as any}
                        className="w-full border border-gray-300 rounded-md py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Seleccionar...</option>
                        <option value="piso">Piso</option>
                        <option value="casa">Casa / Chalet</option>
                        <option value="atico">Ático</option>
                        <option value="duplex">Dúplex</option>
                        <option value="estudio">Estudio</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Superficie (m²)
                      </label>
                      <input 
                        type="number" 
                        name="size"
                        value={propertyData.size}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-md py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Ej: 90"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Habitaciones
                      </label>
                      <select 
                        name="rooms"
                        value={propertyData.rooms}
                        onChange={handleInputChange as any}
                        className="w-full border border-gray-300 rounded-md py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Seleccionar...</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5+">5 o más</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Estado
                      </label>
                      <select 
                        name="condition"
                        value={propertyData.condition}
                        onChange={handleInputChange as any}
                        className="w-full border border-gray-300 rounded-md py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Seleccionar...</option>
                        <option value="nuevo">Nuevo / Reformado</option>
                        <option value="bueno">Buen estado</option>
                        <option value="reformar">A reformar</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-between mt-4">
                    <button 
                      type="button"
                      onClick={() => setCurrentStep(ValuationStep.Address)}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Volver
                    </button>
                    <button 
                      type="button"
                      onClick={handleContinueToResults}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-md shadow-md transition-colors"
                    >
                      Continuar
                    </button>
                  </div>
                </div>
              )}
              
              {/* Paso 3: Datos personales y resultado */}
              {currentStep === ValuationStep.Result && (
                <div className="bg-white rounded-lg shadow-md p-4">
                  <div className="mb-4">
                    <div className="text-xl font-bold text-center text-blue-700 mb-2">
                      {calculateEstimatedValue()}
                    </div>
                    <p className="text-center text-sm text-gray-500">
                      Valoración estimada de tu propiedad
                    </p>
                  </div>
                  
                  <div className="bg-blue-50 p-3 rounded-md mb-4 text-sm">
                    <div><span className="font-medium">Dirección:</span> {address}</div>
                    {propertyData.type && <div><span className="font-medium">Tipo:</span> {propertyData.type}</div>}
                    {propertyData.size && <div><span className="font-medium">Superficie:</span> {propertyData.size} m²</div>}
                    {propertyData.rooms && <div><span className="font-medium">Habitaciones:</span> {propertyData.rooms}</div>}
                    {propertyData.condition && <div><span className="font-medium">Estado:</span> {propertyData.condition}</div>}
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre completo
                      </label>
                      <input 
                        type="text" 
                        name="name"
                        value={userData.name}
                        onChange={handleUserInputChange}
                        className={`w-full border ${formErrors.name ? 'border-red-500' : 'border-gray-300'} rounded-md py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                        placeholder="Tu nombre y apellidos"
                      />
                      {formErrors.name && (
                        <p className="text-red-500 text-xs mt-1">Por favor, introduce tu nombre completo</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Teléfono
                      </label>
                      <input 
                        type="tel" 
                        name="phone"
                        value={userData.phone}
                        onChange={handleUserInputChange}
                        className={`w-full border ${formErrors.phone ? 'border-red-500' : 'border-gray-300'} rounded-md py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                        placeholder="Ej: 612345678"
                      />
                      {formErrors.phone && (
                        <p id="phone-error" className="text-red-500 text-xs mt-1">Por favor, introduce un teléfono válido</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Contraseña
                      </label>
                      <div className="relative">
                        <input 
                          type={showPassword ? "text" : "password"} 
                          name="password"
                          value={userData.password}
                          onChange={handleUserInputChange}
                          className={`w-full border ${formErrors.password ? 'border-red-500' : 'border-gray-300'} rounded-md py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10`}
                          placeholder="Crea una contraseña"
                        />
                        <button 
                          type="button"
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                      {formErrors.password && (
                        <p className="text-red-500 text-xs mt-1">La contraseña debe tener al menos 6 caracteres</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex justify-between mt-4">
                    <button 
                      type="button"
                      onClick={() => setCurrentStep(ValuationStep.PropertyDetails)}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Volver
                    </button>
                    <button 
                      type="button"
                      onClick={handleRegisterAndShowValuation}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-md shadow-md transition-colors"
                    >
                      Guardar valoración
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Valoraciones simplificadas */}
            <div className="mt-3">
              <div className="text-xs text-gray-600">★★★★★ <span className="font-medium">4.6/5</span> basado en <span className="font-medium">900+</span> valoraciones</div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;
