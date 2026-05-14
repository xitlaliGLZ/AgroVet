<?php

$server = "localhost";
$usuario = "sa";
$password = "123456";
$bd = "AgroVet";

$conn = new mysqli($server, $usuario, $password, $bd);

if ($conn->connect_error) {
    die("Error de conexión: " . $conn->connect_error);
}

// Array of products to insert
$productos = [
    // MEDICAMENTOS
    ['Oxivolt', 'Medicamento', 120, 10],
    ['Super Flumi', 'Medicamento', 110, 12],
    ['Iverfull', 'Medicamento', 95, 15],
    ['Napzin', 'Medicamento', 130, 8],
    ['Biodipirona', 'Medicamento', 90, 20],
    ['Laxotonico Oral', 'Medicamento', 85, 10],
    ['Rulaxton', 'Medicamento', 140, 7],
    ['Hepatonic', 'Medicamento', 150, 6],
    ['Actynoxel', 'Medicamento', 135, 9],
    ['Oleovet Enzimatico', 'Medicamento', 125, 11],
    ['Tomo', 'Medicamento', 80, 13],
    ['Quimipirona', 'Medicamento', 100, 14],
    ['Dexavet', 'Medicamento', 160, 5],
    ['Polvo Optico', 'Medicamento', 70, 18],
    ['Jabon Asuntol', 'Medicamento', 60, 22],
    ['Panacur 22%', 'Medicamento', 150, 8],
    ['Telmivet', 'Medicamento', 145, 9],
    ['Bolfo', 'Medicamento', 95, 16],
    ['Bolos Uterinos', 'Medicamento', 170, 4],
    ['Andobiotic', 'Medicamento', 155, 6],
    ['Calciprotein', 'Medicamento', 120, 10],
    ['Suero Dextrosa', 'Medicamento', 50, 25],
    ['Caltonic', 'Medicamento', 110, 12],
    ['Extracto de Higado', 'Medicamento', 130, 7],
    ['Complejo B', 'Medicamento', 75, 20],
    ['Vitafor', 'Medicamento', 90, 15],
    ['Fluorfenicol', 'Medicamento', 160, 6],
    ['Pomada Yodada', 'Medicamento', 55, 30],
    ['Balsamo Blanco', 'Medicamento', 65, 18],
    ['Ortolan', 'Medicamento', 140, 9],
    ['Reugol', 'Medicamento', 100, 11],
    ['Mamisan', 'Medicamento', 120, 10],
    // ACCESORIOS
    ['Correa', 'Accesorio', 80, 20],
    ['Pechera', 'Accesorio', 150, 10],
    ['Collar', 'Accesorio', 60, 25],
    ['Correa de Cuero', 'Accesorio', 120, 15],
    ['Bosales', 'Accesorio', 200, 5],
    // ACCESORIOS EXTRA
    ['Placa Identificacion', 'Accesorio', 50, 30],
    ['Cama para Mascota', 'Accesorio', 300, 8],
    ['Transportadora', 'Accesorio', 450, 6],
    ['Juguete para Perro', 'Accesorio', 70, 20],
    ['Comedero', 'Accesorio', 90, 18],
    ['Bebedero', 'Accesorio', 85, 17],
    ['Cepillo', 'Accesorio', 60, 22],
    ['Shampoo Mascotas', 'Accesorio', 110, 14]
];

foreach ($productos as $prod) {
    $nombre = $conn->real_escape_string($prod[0]);
    $tipo = $conn->real_escape_string($prod[1]);
    $precio = $prod[2];
    $cantidad = $prod[3];

    $sql = "INSERT INTO Productos (nombre, tipo, precio, cantidad) VALUES ('$nombre', '$tipo', $precio, $cantidad)";

    if ($conn->query($sql) === TRUE) {
        echo "Producto '$nombre' insertado correctamente.<br>";
    } else {
        echo "Error al insertar '$nombre': " . $conn->error . "<br>";
    }
}

$conn->close();

?>