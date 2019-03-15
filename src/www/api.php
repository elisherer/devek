<?php
$method = $_SERVER['REQUEST_METHOD'];
$pathname = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

function getIP() {
  if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
    return $_SERVER['HTTP_CLIENT_IP'];
  }
  elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
    return $_SERVER['HTTP_X_FORWARDED_FOR'];
  }
  else {
    return $_SERVER['REMOTE_ADDR'];
  }
}

header('Content-Type: application/json');

if ($method == 'GET' && $pathname == '/api/ip') {
  echo '{"ip_address":"' . $ip_address . '"}';
}
else {
  http_response_code(404);
  echo '{"error":"not_found"}';
}
?>