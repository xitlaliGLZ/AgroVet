// Firebase initialization (same as login.html)
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js';
import { getAuth, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js';
import { getFirestore, doc, setDoc, getDoc, collection, getDocs, query, where } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js';

const firebaseConfig = {
    apiKey: "AIzaSyB7v0bI0p_GiRAI9IEMaLhnkYRePkECNqc",
    authDomain: "agrovet-edb35.firebaseapp.com",
    projectId: "agrovet-edb35",
    storageBucket: "agrovet-edb35.firebasestorage.app",
    messagingSenderId: "549615594048",
    appId: "1:549615594048:web:42f7eab574eb9c25ca4da5",
    measurementId: "G-5YFZVDHHRX"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Carrito local
let carrito = [];

// Agregar producto al carrito
export function agregarAlCarrito(nombre, tipo, precio) {
    const productoExistente = carrito.find(p => p.nombre === nombre);
    
    if (productoExistente) {
        productoExistente.cantidad++;
    } else {
        carrito.push({
            nombre: nombre,
            tipo: tipo,
            precio: precio,
            cantidad: 1
        });
    }
    
    guardarCarritoLocal();
    actualizarCarritoUI();
    mostrarNotificacion(`${nombre} agregado al carrito`);
}

// Remover producto del carrito
export function removerDelCarrito(nombre) {
    carrito = carrito.filter(p => p.nombre !== nombre);
    guardarCarritoLocal();
    actualizarCarritoUI();
}

// Guardar carrito en localStorage
function guardarCarritoLocal() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

// Cargar carrito desde localStorage
export function cargarCarritoLocal() {
    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
        carrito = JSON.parse(carritoGuardado);
    }
}

// Obtener resumen del carrito
export function obtenerResumenCarrito() {
    const subtotal = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    const cantidad = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    return {
        items: carrito,
        subtotal,
        cantidad
    };
}

export function obtenerDatosEnvio() {
    return {
        nombre: document.getElementById('shipping-name')?.value.trim() || '',
        telefono: document.getElementById('shipping-phone')?.value.trim() || '',
        correo: document.getElementById('shipping-email')?.value.trim() || '',
        calle: document.getElementById('shipping-street')?.value.trim() || '',
        numero: document.getElementById('shipping-number')?.value.trim() || '',
        colonia: document.getElementById('shipping-colony')?.value.trim() || '',
        ciudad: document.getElementById('shipping-city')?.value.trim() || '',
        estado: document.getElementById('shipping-state')?.value.trim() || '',
        codigoPostal: document.getElementById('shipping-postal')?.value.trim() || '',
        referencias: document.getElementById('shipping-references')?.value.trim() || ''
    };
}

function generarResumenDireccion(envio) {
    if (!envio || !envio.calle) {
        return 'Completa tus datos de envío para ver el resumen aquí.';
    }

    return `${envio.nombre}, ${envio.telefono}, ${envio.correo}\n` +
        `${envio.calle} ${envio.numero}, Col. ${envio.colonia}, ${envio.ciudad}, ${envio.estado}, CP ${envio.codigoPostal}` +
        (envio.referencias ? `\nReferencias: ${envio.referencias}` : '');
}

export function actualizarResumenDireccion() {
    const envio = obtenerDatosEnvio();
    const summaryEl = document.getElementById('shipping-summary');
    if (!summaryEl) return;
    const texto = generarResumenDireccion(envio).replace(/\n/g, '<br>');
    summaryEl.innerHTML = `<strong>Resumen de dirección</strong><p>${texto}</p>`;
}

function mostrarError(message) {
    const errorEl = document.getElementById('checkout-error');
    if (!errorEl) return;
    errorEl.textContent = message;
    errorEl.style.display = 'block';
}

function ocultarError() {
    const errorEl = document.getElementById('checkout-error');
    if (!errorEl) return;
    errorEl.style.display = 'none';
    errorEl.textContent = '';
}

export function validarEnvio() {
    const envio = obtenerDatosEnvio();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^[0-9]{8,15}$/;
    const postalPattern = /^[0-9]{4,10}$/;

    if (!envio.nombre || !envio.telefono || !envio.correo || !envio.calle || !envio.numero || !envio.colonia || !envio.ciudad || !envio.estado || !envio.codigoPostal) {
        mostrarError('Completa todos los campos de envío para que tu pedido llegue sin contratiempos.');
        return false;
    }
    if (!emailPattern.test(envio.correo)) {
        mostrarError('Ingresa un correo válido, por ejemplo: hola@agrovet.com');
        return false;
    }
    if (!phonePattern.test(envio.telefono)) {
        mostrarError('El teléfono debe tener entre 8 y 15 dígitos numéricos.');
        return false;
    }
    if (!postalPattern.test(envio.codigoPostal)) {
        mostrarError('El código postal debe ser numérico y tener entre 4 y 10 dígitos.');
        return false;
    }
    ocultarError();
    return true;
}

// Actualizar UI del carrito
export function actualizarCarritoUI() {
    const carritoContainer = document.getElementById('carrito-items');
    const totalSpan = document.getElementById('carrito-total');
    
    if (!carritoContainer) return;
    
    carritoContainer.innerHTML = '';
    let total = 0;
    
    carrito.forEach(item => {
        const itemTotal = item.precio * item.cantidad;
        total += itemTotal;
        
        carritoContainer.innerHTML += `
            <div class="carrito-item">
                <h3>${item.nombre}</h3>
                <p>Tipo: ${item.tipo}</p>
                <p>Precio: $${item.precio}</p>
                <div class="cantidad-control">
                    <button onclick="cambiarCantidad('${item.nombre}', -1)">-</button>
                    <span>${item.cantidad}</span>
                    <button onclick="cambiarCantidad('${item.nombre}', 1)">+</button>
                </div>
                <p>Subtotal: $${itemTotal}</p>
                <button onclick="removerDelCarritoUI('${item.nombre}')">Eliminar</button>
            </div>
        `;
    });
    
    if (totalSpan) {
        totalSpan.textContent = `Total: $${total}`;
    }
    
    actualizarBadgeCarrito();

    if (typeof window !== 'undefined' && typeof window.onCarritoUpdated === 'function') {
        window.onCarritoUpdated();
    }
}

// Actualizar badge del carrito
function actualizarBadgeCarrito() {
    const badge = document.getElementById('carrito-badge');
    if (badge) {
        const cantidad = carrito.reduce((sum, item) => sum + item.cantidad, 0);
        badge.textContent = cantidad;
    }
}

// Cambiar cantidad
export function cambiarCantidad(nombre, cambio) {
    const producto = carrito.find(p => p.nombre === nombre);
    if (producto) {
        producto.cantidad += cambio;
        if (producto.cantidad <= 0) {
            removerDelCarrito(nombre);
        } else {
            guardarCarritoLocal();
            actualizarCarritoUI();
        }
    }
}

// Remover del carrito (UI)
export function removerDelCarritoUI(nombre) {
    removerDelCarrito(nombre);
}

if (typeof window !== 'undefined') {
    window.cambiarCantidad = cambiarCantidad;
    window.removerDelCarritoUI = removerDelCarritoUI;
}

// Guardar compra en Firestore
export async function guardarCompra() {
    const envio = obtenerDatosEnvio();
    if (!validarEnvio()) {
        return;
    }

    onAuthStateChanged(auth, async (user) => {
        if (!user) {
            alert('Debes iniciar sesión para realizar una compra');
            window.location.href = 'login.html';
            return;
        }
        
        if (carrito.length === 0) {
            alert('El carrito está vacío');
            return;
        }
        
        try {
            const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
            const direccionResumen = generarResumenDireccion(envio);
            const compra = {
                usuarioId: user.uid,
                usuario: user.email,
                productos: carrito,
                total: total,
                fecha: new Date().toISOString(),
                estado: 'pendiente',
                envio: envio,
                direccionResumen: direccionResumen
            };
            
            await setDoc(doc(db, 'compras', user.uid + '_' + Date.now()), compra);
            alert('¡Compra realizada con éxito! Tu pedido será procesado en breve.');
            carrito = [];
            guardarCarritoLocal();
            actualizarCarritoUI();
            window.location.href = 'index.html';
        } catch (error) {
            alert('Error al guardar compra: ' + error.message);
        }
    });
}

// Guardar cita en Firestore
export async function guardarCita(nombre, animal, fecha, hora) {
    onAuthStateChanged(auth, async (user) => {
        if (!user) {
            alert('Debes iniciar sesión para agendar una cita');
            window.location.href = 'login.html';
            return;
        }
        
        try {
            const citaQuery = query(
                collection(db, 'citas'),
                where('fecha', '==', fecha),
                where('hora', '==', hora)
            );
            const citaSnapshot = await getDocs(citaQuery);

            if (!citaSnapshot.empty) {
                mostrarNotificacion('Ya hay una cita registrada para ese día y hora. Por favor elige otra hora o día.', 'error');
                return;
            }

            const cita = {
                usuarioId: user.uid,
                usuario: user.email,
                nombre: nombre,
                animal: animal,
                fecha: fecha,
                hora: hora,
                fechaCreacion: new Date().toISOString(),
                estado: 'pendiente'
            };
            
            await setDoc(doc(db, 'citas', user.uid + '_' + Date.now()), cita);
            mostrarNotificacion('Cita agendada exitosamente');
            limpiarFormularioCita();
        } catch (error) {
            mostrarNotificacion('Error al guardar cita: ' + error.message, 'error');
        }
    });
}

// Limpiar formulario de cita
function limpiarFormularioCita() {
    const campos = document.querySelectorAll('#citas input, #citas textarea');
    campos.forEach(campo => campo.value = '');
}

// Mostrar notificación
function mostrarNotificacion(mensaje, tipo = 'success') {
    const notif = document.createElement('div');
    notif.textContent = mensaje;
    const color = tipo === 'error' ? '#e74c3c' : '#4CAF50';
    notif.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${color};
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
    `;
    document.body.appendChild(notif);
    setTimeout(() => notif.remove(), 3000);

    const citaMensaje = document.getElementById('cita-mensaje');
    if (citaMensaje) {
        citaMensaje.textContent = mensaje;
        citaMensaje.style.color = tipo === 'error' ? '#e74c3c' : '#2e7d32';
        citaMensaje.style.fontWeight = 'bold';
        citaMensaje.style.marginTop = '10px';
    }
}

// Cerrar sesión
export function cerrarSesion() {
    signOut(auth).then(() => {
        alert('Sesión cerrada');
        localStorage.removeItem('carrito');
        window.location.href = 'login.html';
    }).catch((error) => {
        alert('Error al cerrar sesión: ' + error.message);
    });
}

// Verificar autenticación con roles
export function verificarAutenticacion() {
    onAuthStateChanged(auth, async (user) => {
        const areaLogin = document.getElementById('area-login');
        const areaCuenta = document.getElementById('area-cuenta');
        
        if (user) {
            // Obtener datos del usuario de Firestore
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            const userData = userDoc.data();
            const userRole = userData?.rol || 'cliente';
            
            if (areaLogin) areaLogin.style.display = 'none';
            if (areaCuenta) areaCuenta.style.display = 'block';
            
            const nombreUsuario = document.getElementById('nombre-usuario');
            if (nombreUsuario) nombreUsuario.textContent = user.email;
            
            // Redirigir según el rol si estamos en la página de login
            if (window.location.pathname.includes('login.html')) {
                if (userRole === 'admin') {
                    window.location.href = 'admin.html';
                } else {
                    window.location.href = 'index.html';
                }
            }
            
            // Mostrar/ocultar elementos según el rol
            const elementosAdmin = document.querySelectorAll('.admin-only');
            const elementosCliente = document.querySelectorAll('.cliente-only');
            
            if (userRole === 'admin') {
                elementosAdmin.forEach(el => el.style.display = 'block');
                elementosCliente.forEach(el => el.style.display = 'none');
            } else {
                elementosAdmin.forEach(el => el.style.display = 'none');
                elementosCliente.forEach(el => el.style.display = 'block');
            }

            const mainActionButton = document.getElementById('btn-main-action');
            const introNote = document.getElementById('intro-note');
            if (mainActionButton) {
                mainActionButton.href = '#productos';
                mainActionButton.textContent = 'Ver catálogo';
            }
            if (introNote) {
                introNote.style.display = 'none';
            }
            
        } else {
            if (areaLogin) areaLogin.style.display = 'block';
            if (areaCuenta) areaCuenta.style.display = 'none';
            
            // Ocultar elementos que requieren login
            const elementosAdmin = document.querySelectorAll('.admin-only');
            const elementosCliente = document.querySelectorAll('.cliente-only');
            elementosAdmin.forEach(el => el.style.display = 'none');
            elementosCliente.forEach(el => el.style.display = 'none');

            const mainActionButton = document.getElementById('btn-main-action');
            const introNote = document.getElementById('intro-note');
            if (mainActionButton) {
                mainActionButton.href = 'login.html';
                mainActionButton.textContent = 'Iniciar sesión / crear cuenta';
            }
            if (introNote) {
                introNote.style.display = 'block';
            }

            if (!window.location.pathname.includes('login.html')) {
                localStorage.removeItem('carrito');
                window.location.href = 'login.html';
                return;
            }
        }
    });
}

// Función para cargar ventas en el panel de administración
export async function cargarVentas() {
    const ventasList = document.getElementById('ventas-list');
    if (!ventasList) return;
    
    try {
        const querySnapshot = await getDocs(collection(db, 'compras'));
        ventasList.innerHTML = '';
        
        querySnapshot.forEach((doc) => {
            const venta = doc.data();
            const ventaElement = document.createElement('div');
            ventaElement.className = 'venta-item';
            ventaElement.innerHTML = `
                <h3>Compra de ${venta.usuario}</h3>
                <p>Fecha: ${new Date(venta.fecha).toLocaleDateString()}</p>
                <p>Total: $${venta.total}</p>
                <p>Estado: ${venta.estado}</p>
                <ul>
                    ${venta.productos.map(p => `<li>${p.nombre} x${p.cantidad} - $${p.precio * p.cantidad}</li>`).join('')}
                </ul>
            `;
            ventasList.appendChild(ventaElement);
        });
    } catch (error) {
        console.error('Error cargando ventas:', error);
        ventasList.innerHTML = '<p>Error al cargar las ventas</p>';
    }
}

// Función para cargar citas en el panel de administración
export async function cargarCitas() {
    const citasList = document.getElementById('citas-list');
    if (!citasList) return;
    
    try {
        const querySnapshot = await getDocs(collection(db, 'citas'));
        citasList.innerHTML = '';
        
        querySnapshot.forEach((doc) => {
            const cita = doc.data();
            const citaElement = document.createElement('div');
            citaElement.className = 'cita-item';
            citaElement.innerHTML = `
                <h3>Cita de ${cita.nombreCliente}</h3>
                <p>Email: ${cita.emailCliente}</p>
                <p>Fecha: ${new Date(cita.fecha).toLocaleDateString()}</p>
                <p>Hora: ${cita.hora}</p>
                <p>Servicio: ${cita.servicio}</p>
                <p>Mascota: ${cita.nombreMascota}</p>
                <p>Estado: ${cita.estado || 'pendiente'}</p>
            `;
            citasList.appendChild(citaElement);
        });
    } catch (error) {
        console.error('Error cargando citas:', error);
        citasList.innerHTML = '<p>Error al cargar las citas</p>';
    }
}

// Función de logout
export async function logout() {
    try {
        await signOut(auth);
        localStorage.removeItem('carrito');
        window.location.href = 'login.html';
    } catch (error) {
        console.error('Error al cerrar sesión:', error);
    }
}

// Hacer logout disponible globalmente
window.logout = logout;

// Inicializar funciones del panel de administración si estamos en admin.html
if (window.location.pathname.includes('admin.html')) {
    document.addEventListener('DOMContentLoaded', () => {
        cargarVentas();
        cargarCitas();
    });
}
