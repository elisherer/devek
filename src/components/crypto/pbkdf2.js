const plaintext = "hello";
const password = "world";

let enc = new TextEncoder();

window.crypto.subtle.importKey(
  "raw",
  enc.encode(password),
  {name: "PBKDF2"},
  false,
  ["deriveBits", "deriveKey"]
).then(keyMaterial => window.crypto.subtle.deriveKey(
  {
    "name": "PBKDF2",
    //salt: salt,
    "iterations": 100000,
    "hash": "SHA-256"
  },
  keyMaterial,
  { "name": "AES-GCM", "length": 256},
  true,
  [ "encrypt", "decrypt" ]
)).then(key => window.crypto.subtle.encrypt(
  {
    name: "AES-GCM",
    //iv: iv
  },
  key,
  plaintext
)).then(text => {
  console.log(text);
});

