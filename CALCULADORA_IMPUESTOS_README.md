# Calculadora de Impuestos - AgroVet

Sistema de cálculo de impuestos (IVA) para el proyecto veterinario AgroVet.

## Características

- ✅ Calculadora de IVA (19%)
- ✅ API REST en Flask
- ✅ CORS habilitado para acceso desde frontend
- ✅ Interfaz HTML amigable
- ✅ Validación de datos
- ✅ Soporte para cálculo individual y múltiples productos

## Estructura del Proyecto

```
app.py                      # Backend Flask principal
calculadora_impuestos.html  # Frontend HTML
requirements.txt            # Dependencias de Python
```

## Configuración Rápida

### 1. Instalar Dependencias

```bash
pip install -r requirements.txt
```

### 2. Ejecutar el Backend Flask

```bash
python app.py
```

El servidor se ejecutará en: `http://localhost:5000`

### 3. Abrir el Frontend

Abre tu navegador en:
```
file:///C:/Users/Xitlali Gonzalez/OneDrive/Documentos/8semest5re/proyecto_veterinaria - copia/html5up-massively/calculadora_impuestos.html
```

O sirve los archivos con un servidor:

```bash
# Usando Python
python -m http.server 8000
```

Luego accede a: `http://localhost:8000/calculadora_impuestos.html`

## Endpoints API

### 1. Calcular IVA Simple

**Endpoint:** `POST /api/calcular-impuestos`

**Request:**
```json
{
    "subtotal": 100.00
}
```

**Response:**
```json
{
    "subtotal": 100.00,
    "iva": 19.00,
    "iva_rate": 19,
    "total": 119.00
}
```

### 2. Calcular Múltiples Productos

**Endpoint:** `POST /api/calcular-multiples-impuestos`

**Request:**
```json
{
    "productos": [
        {"nombre": "Medicamento A", "precio": 50},
        {"nombre": "Medicamento B", "precio": 75}
    ]
}
```

**Response:**
```json
{
    "productos": [
        {
            "nombre": "Medicamento A",
            "precio": 50.00,
            "iva": 9.50,
            "total": 59.50
        },
        {
            "nombre": "Medicamento B",
            "precio": 75.00,
            "iva": 14.25,
            "total": 89.25
        }
    ],
    "subtotal": 125.00,
    "iva_total": 23.75,
    "iva_rate": 19,
    "total": 148.75
}
```

### 3. Verificar Estado del Servidor

**Endpoint:** `GET /api/salud`

**Response:**
```json
{
    "estado": "OK",
    "mensaje": "Servidor Flask activo"
}
```

## Ajustar la Tasa de IVA

Para cambiar el porcentaje de IVA, edita la línea en `app.py`:

```python
IVA_RATE = 0.19  # Cambiar 19 por el porcentaje deseado (ej: 0.21 para 21%)
```

## Troubleshooting

### Error: "No se pudo conectar con el servidor"

- Asegúrate de que Flask está ejecutándose en `http://localhost:5000`
- Verifica que no haya otro proceso usando el puerto 5000
- Comprueba que Flask-CORS esté instalado correctamente

### CORS Error

Flask-CORS ya está configurado en `app.py`. Si aún hay problemas:

1. Asegúrate de que estás ejecutando `python app.py` desde el directorio correcto
2. Verifica la consola de Flask para mensajes de error

### Puerto 5000 en Uso

Cambia el puerto en `app.py`:
```python
app.run(debug=True, port=5001)  # Usar puerto 5001
```

Y actualiza la URL en `calculadora_impuestos.html`:
```javascript
const API_URL = 'http://localhost:5001/api/calcular-impuestos';
```

## Integración con Carrito

Para integrar con tu carrito existente (`carrito.js`), puedes llamar el endpoint:

```javascript
async function calcularTotalConImpuestos(subtotal) {
    const response = await fetch('http://localhost:5000/api/calcular-impuestos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ subtotal: subtotal })
    });
    
    return await response.json();
}
```

## Notas Importantes

- El IVA predeterminado es del **19%** (ajustable)
- Se redondean todos los resultados a 2 decimales
- La validación rechaza montos negativos
- CORS está habilitado para todas las rutas

## Licencia

Mismo que el proyecto AgroVet
