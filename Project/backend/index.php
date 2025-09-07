
<?php
// backend/index.php (MariaDB compatible)
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Update the credentials below for your MariaDB instance
$mysqli = new mysqli('localhost', 'myuser', 'mypassword', 'datacapture');
if ($mysqli->connect_errno) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to connect to MariaDB: ' . $mysqli->connect_error]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $stmt = $mysqli->prepare('INSERT INTO entries (data) VALUES (?)');
    $jsonData = json_encode($data);
    $stmt->bind_param('s', $jsonData);
    $stmt->execute();
    if ($stmt->affected_rows > 0) {
        echo json_encode(['success' => true]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to save data.']);
    }
    $stmt->close();
} elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $result = $mysqli->query('SELECT * FROM entries');
    $entries = [];
    while ($row = $result->fetch_assoc()) {
        $row['data'] = json_decode($row['data'], true);
        $entries[] = $row;
    }
    echo json_encode($entries);
}
$mysqli->close();
