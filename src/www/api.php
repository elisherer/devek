<?php
$method = $_SERVER['REQUEST_METHOD'];
$pathname = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

function get_ip_addr() {
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

function http_res_code( $code , $text ) {
  $protocol = (isset($_SERVER['SERVER_PROTOCOL']) ? $_SERVER['SERVER_PROTOCOL'] : 'HTTP/1.0');
  header($protocol . ' ' . $code . ' ' . $text);
}

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: https://devek.app');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-Requested-With');

if ($method == 'GET' && $pathname == '/api/ip') {
  echo '{"ip_address":"' . get_ip_addr() . '"}';
}
else {
  http_res_code(404, 'Not Found');
  echo '{"error":true,"message":"No such path ' . $pathname . '"}';
}
?>