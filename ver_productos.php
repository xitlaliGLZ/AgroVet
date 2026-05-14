<?php

$server = "localhost";
$usuario = "sa";
$password = "123456";
$bd = "AgroVet";

$conn = new mysqli($server, $usuario, $password, $bd);

if ($conn->connect_error) {
    die("Error de conexión: " . $conn->connect_error);
}

$sql = "SELECT * FROM Productos";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    echo "<table border='1'><tr><th>ID</th><th>Nombre</th><th>Tipo</th><th>Precio</th><th>Cantidad</th></tr>";
    while($row = $result->fetch_assoc()) {
        echo "<tr><td>" . $row["id"]. "</td><td>" . $row["nombre"]. "</td><td>" . $row["tipo"]. "</td><td>" . $row["precio"]. "</td><td>" . $row["cantidad"]. "</td></tr>";
    }
    echo "</table>";
} else {
    echo "No hay productos en la base de datos.";
}

$conn->close();

?>