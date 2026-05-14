from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Configuración de tasas de impuesto
IVA_RATE = 0.19  # 19% IVA (ajusta según tu país)

@app.route('/api/calcular-impuestos', methods=['POST'])
def calcular_impuestos():
    """
    Endpoint para calcular impuestos (IVA)
    
    Body JSON esperado:
    {
        "subtotal": 100.00
    }
    
    Respuesta:
    {
        "subtotal": 100.00,
        "iva": 19.00,
        "total": 119.00
    }
    """
    try:
        data = request.get_json()
        
        if not data or 'subtotal' not in data:
            return jsonify({'error': 'Subtotal es requerido'}), 400
        
        subtotal = float(data['subtotal'])
        
        if subtotal < 0:
            return jsonify({'error': 'El subtotal no puede ser negativo'}), 400
        
        # Calcular IVA
        iva = subtotal * IVA_RATE
        total = subtotal + iva
        
        return jsonify({
            'subtotal': round(subtotal, 2),
            'iva': round(iva, 2),
            'iva_rate': IVA_RATE * 100,
            'total': round(total, 2)
        }), 200
    
    except ValueError:
        return jsonify({'error': 'Subtotal debe ser un número válido'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/calcular-multiples-impuestos', methods=['POST'])
def calcular_multiples_impuestos():
    """
    Endpoint para calcular impuestos para múltiples productos
    
    Body JSON esperado:
    {
        "productos": [
            {"nombre": "Producto 1", "precio": 100},
            {"nombre": "Producto 2", "precio": 50}
        ]
    }
    """
    try:
        data = request.get_json()
        
        if not data or 'productos' not in data:
            return jsonify({'error': 'Lista de productos es requerida'}), 400
        
        productos = data['productos']
        subtotal_total = 0
        productos_procesados = []
        
        for producto in productos:
            precio = float(producto.get('precio', 0))
            if precio < 0:
                return jsonify({'error': 'Los precios no pueden ser negativos'}), 400
            
            iva = precio * IVA_RATE
            total_producto = precio + iva
            
            productos_procesados.append({
                'nombre': producto.get('nombre', 'Producto'),
                'precio': round(precio, 2),
                'iva': round(iva, 2),
                'total': round(total_producto, 2)
            })
            
            subtotal_total += precio
        
        iva_total = subtotal_total * IVA_RATE
        total_general = subtotal_total + iva_total
        
        return jsonify({
            'productos': productos_procesados,
            'subtotal': round(subtotal_total, 2),
            'iva_total': round(iva_total, 2),
            'iva_rate': IVA_RATE * 100,
            'total': round(total_general, 2)
        }), 200
    
    except (ValueError, KeyError) as e:
        return jsonify({'error': f'Error en los datos: {str(e)}'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/salud', methods=['GET'])
def salud():
    """Endpoint para verificar que el servidor está funcionando"""
    return jsonify({'estado': 'OK', 'mensaje': 'Servidor Flask activo'}), 200

if __name__ == '__main__':
    app.run(debug=True, port=5000)
