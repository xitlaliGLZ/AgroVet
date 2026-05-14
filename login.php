<?php

$server = "localhost";
$usuario = "sa";
$password = "123456";
$bd = "AgroVet";

$conn = new mysqli($server, $usuario, $password, $bd);

if ($conn->connect_error) {
    die("Error de conexión");
}

$correo = $_POST['correo'];
$pass = $_POST['password'];

$sql = "SELECT * FROM usuarios WHERE correo='$correo' AND password='$pass'";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    echo "Bienvenido a AgroVet";
} else {
    echo "Usuario o contraseña incorrectos";
}

$conn->close();

?>