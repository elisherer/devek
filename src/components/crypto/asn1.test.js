const parseCertificate = require('./asn1');




const c1 = `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
P0VbDxUMTGrdMmK2BJuq`;

//eslint-disable-next-line
const c2 = `MIIC2jCCAkMCAg38MA0GCSqGSIb3DQEBBQUAMIGbMQswCQYDVQQGEwJKUDEOMAwG
A1UECBMFVG9reW8xEDAOBgNVBAcTB0NodW8ta3UxETAPBgNVBAoTCEZyYW5rNERE
MRgwFgYDVQQLEw9XZWJDZXJ0IFN1cHBvcnQxGDAWBgNVBAMTD0ZyYW5rNEREIFdl
YiBDQTEjMCEGCSqGSIb3DQEJARYUc3VwcG9ydEBmcmFuazRkZC5jb20wHhcNMTIw
ODIyMDUyNzQxWhcNMTcwODIxMDUyNzQxWjBKMQswCQYDVQQGEwJKUDEOMAwGA1UE
CAwFVG9reW8xETAPBgNVBAoMCEZyYW5rNEREMRgwFgYDVQQDDA93d3cuZXhhbXBs
ZS5jb20wggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQC0z9FeMynsC8+u
dvX+LciZxnh5uRj4C9S6tNeeAlIGCfQYk0zUcNFCoCkTknNQd/YEiawDLNbxBqut
bMDZ1aarys1a0lYmUeVLCIqvzBkPJTSQsCopQQ9V8WuT252zzNzs68dVGNdCJd5J
NRQykpwexmnjPPv0mvj7i8XgG379TyW6P+WWV5okeUkXJ9eJS2ouDYdR2SM9BoVW
+FgxDu6BmXhozW5EfsnajFp7HL8kQClI0QOc79yuKl3492rH6bzFsFn2lfwWy9ic
7cP8EpCTeFp1tFaD+vxBhPZkeTQ1HKx6hQ5zeHIB5ySJJZ7af2W8r4eTGYzbdRW2
4DDHCPhZAgMBAAEwDQYJKoZIhvcNAQEFBQADgYEAQMv+BFvGdMVzkQaQ3/+2noVz
/uAKbzpEL8xTcxYyP3lkOeh4FoxiSWqy5pGFALdPONoDuYFpLhjJSZaEwuvjI/Tr
rGhLV1pRG9frwDFshqD2Vaj4ENBCBh6UpeBop5+285zQ4SI7q4U9oSebUDJiuOx6
+tZ9KynmrbJpTSi0+BM=`;

//const certificateBytes = new Uint8Array(Buffer.from(c2.replace(/\n/g,''), 'base64').toString().split('').map(c => c.charCodeAt()));

//const ob = parseCertificate(certificateBytes);
const asn = parseCertificate(c1);
console.log(require('util').inspect(asn, { depth: 6, colors: true, maxArrayLength: 5 })); //eslint-disable-line
/*

const tder = require('./asn1.org');
console.log(tder.interpreter.certInterpreter(tder.parsePem(c1))); //eslint-disable-line*/
/*
`
Certificate:
    Data:
        Version: 3 (0x2)
        Serial Number:
            49:4b:dd:71:e8:7d:b2:d1
    Signature Algorithm: sha256WithRSAEncryption
        Issuer: C=IT, ST=Italy, L=Milan, O=CheBanca, OU=Sicurezza, CN=DEV CheBanca CA/emailAddress=sicurezza@chebanca.it
        Validity
            Not Before: Mar  5 14:07:00 2019 GMT
            Not After : Mar  5 14:07:00 2028 GMT
        Subject: 2.5.4.97=PSDIT-CB-000000, C=IT, CN=CB TPP SANDBOX, OU=TPP, O=CB TPP SANDBOX, ST=Italy, L=Milan
        Subject Public Key Info:
            Public Key Algorithm: rsaEncryption
                Public-Key: (4096 bit)
                Modulus:
                    00:b7:76:80:4f:0b:0b:4e:94:70:c1:84:50:c1:74:
                    43:39:6f:c6:d0:80:22:67:02:c8:b3:d2:a7:45:5b:
                    19:13:b9:64:c6:ea:55:c0:eb:34:e1:45:45:2a:54:
                    29:db:d2:93:55:42:df:68:f7:a9:49:f8:34:ff:86:
                    d2:9f:c5:04:c2:20:83:2a:56:2e:5b:81:74:c3:d9:
                    90:49:44:13:8e:59:5e:1a:bc:41:bd:27:42:d1:29:
                    5c:f1:98:df:ac:e0:34:2f:70:22:92:19:9e:9d:35:
                    e9:51:16:1b:47:8b:ac:48:b9:5a:af:a7:a9:5d:1d:
                    d1:35:32:51:fe:a2:c3:f5:03:53:de:14:9e:30:b9:
                    a2:f3:cd:ab:4e:de:b2:3f:7f:e5:1a:02:e2:1b:d3:
                    2e:2c:19:dc:47:38:37:0f:fe:db:87:09:8c:62:e7:
                    99:00:57:ee:41:c6:7b:63:24:d3:b5:14:d1:48:36:
                    f8:cd:1f:58:42:f8:ac:72:8e:7e:db:1a:04:f1:68:
                    6a:a8:f4:0a:65:5d:ee:b9:dc:11:10:b0:f8:4e:76:
                    1d:76:13:78:51:e4:54:6e:aa:a1:b3:71:5a:43:42:
                    8f:d0:ff:1b:5a:69:5f:d9:41:ea:9c:93:88:1d:57:
                    43:67:f0:7a:4e:ba:8a:be:4a:c8:b3:a2:5c:a2:d1:
                    c3:32:c9:0c:e1:11:11:c5:b4:3c:b8:66:ce:50:33:
                    9d:6f:89:c6:be:86:b3:29:25:08:44:3d:d6:bb:65:
                    55:cb:7b:04:c1:48:2d:97:a3:07:40:b5:b1:66:20:
                    b9:ef:93:af:c0:91:bc:45:39:6c:7b:11:20:37:4a:
                    23:62:c6:ff:52:96:1e:45:d2:0f:52:b5:ef:02:e1:
                    68:1a:b0:e6:70:02:dd:9a:de:02:98:c4:cf:ff:b9:
                    5b:f2:64:40:73:8b:67:60:e5:68:ef:ef:27:e8:fd:
                    f9:d2:16:b4:52:dd:ab:22:d7:9d:ca:68:73:0f:e0:
                    22:b2:37:24:3b:64:20:d7:1e:c0:1d:06:b6:c1:5d:
                    4b:e9:a2:90:07:7e:0c:4d:5c:d8:7a:99:25:bc:5f:
                    5d:0d:16:01:7e:ca:b2:25:9e:f3:8b:eb:b8:ee:be:
                    fe:32:e4:62:ec:f4:47:bf:4f:81:ab:88:28:b4:28:
                    1c:2a:06:9d:44:70:62:15:3b:c2:6e:16:53:04:42:
                    6c:81:21:49:a2:5f:8e:12:9a:ff:b3:97:4f:a9:b6:
                    a4:16:bd:d2:43:cb:e8:70:89:e0:5d:ea:d6:c1:52:
                    bf:a1:87:39:59:0a:b5:d4:f4:42:88:24:3a:e3:67:
                    34:97:37:52:4b:44:ad:44:dd:09:8b:04:28:36:33:
                    fe:29:09
                Exponent: 65537 (0x10001)
        X509v3 extensions:
            X509v3 Key Usage:
                Digital Signature, Non Repudiation, Certificate Sign, CRL Sign
            X509v3 Extended Key Usage:
                TLS Web Client Authentication, TLS Web Server Authentication
            X509v3 Subject Alternative Name:
                DNS:tpp.it
            qcStatements:
                0x0......F..0......F.....0......F..0......F..0......F...0@......'.060&0.......'....PSP_AI0.......'....PSP_PI..CheBanca..CB
    Signature Algorithm: sha256WithRSAEncryption
         60:3a:24:76:b7:13:9f:b1:81:90:16:31:43:b9:32:0d:2e:d2:
         d2:93:48:b1:42:8c:68:67:84:e4:6f:aa:54:98:0e:d1:55:61:
         16:22:c4:50:11:c6:f2:6b:9f:6a:ed:04:23:25:fb:55:48:ab:
         6c:74:66:b9:0f:43:4d:ec:ff:5d:30:8e:1a:ca:b8:9d:32:0d:
         7f:66:83:15:83:34:67:43:ab:f4:17:2c:e9:c2:9b:b2:f2:d1:
         e8:0e:a9:be:1a:d1:39:2f:24:94:e8:08:be:f8:cb:9e:57:8f:
         b0:8f:80:6c:69:95:08:e7:b0:e7:ac:09:cf:d9:fd:22:4f:07:
         98:07:45:0f:0f:0a:56:28:1d:9c:b9:a9:6b:47:59:77:91:37:
         34:59:1a:bb:94:df:4b:07:62:09:96:ad:a8:f0:b5:62:b2:16:
         e3:db:86:93:7b:4b:1f:4b:fc:bb:06:e5:24:23:f2:ce:51:e9:
         7a:af:f2:97:ba:46:b2:42:88:e9:a3:5e:c9:e5:20:3a:66:bb:
         b2:f9:5a:59:5d:a2:f3:46:b9:b0:2d:6f:e1:2a:b4:d3:22:2f:
         3b:2e:82:e5:0d:5a:c1:63:cc:19:f6:1e:ee:4f:85:0d:43:1f:
         7e:a4:45:d3:d1:6c:72:b7:4d:c9:bf:90:c5:cb:2b:0c:42:14:
         83:7d:08:0e:2f:3b:d3:c4:ed:86:43:e8:79:6f:c7:7c:6a:b1:
         b5:60:66:41:6b:14:78:d0:4a:00:8d:c8:7a:da:1f:f8:1b:64:
         8c:10:fd:43:64:17:1b:36:7b:43:df:72:b6:9e:81:b8:6e:25:
         aa:d7:a8:35:49:9c:d5:4c:e8:a7:28:aa:6d:b8:a6:91:b4:e5:
         b8:f3:37:07:7c:b8:f9:8b:e7:47:1e:0f:57:31:9a:7e:78:0e:
         ba:37:e2:42:4f:6e:e4:3f:66:b1:2d:9b:e5:c7:8a:2b:f8:ad:
         0c:88:24:ab:c4:99:e6:5e:2b:ee:38:ab:92:1c:16:60:4b:2a:
         10:e7:d5:37:3d:3d:1f:a2:07:a7:a7:72:74:10:b4:5b:67:af:
         93:70:c8:b8:d5:98:78:a2:5f:cb:9c:88:80:d2:5c:e7:ea:5b:
         db:68:2c:b2:a5:27:62:88:23:ea:38:42:17:b4:1f:59:8a:49:
         36:76:79:c8:12:f8:84:f8:1c:74:19:11:6f:83:31:0f:c8:30:
         a8:78:a4:80:0e:6a:ca:8a:6d:de:77:75:e3:af:51:2a:52:4a:
         78:4e:47:35:4b:27:04:0b:86:0f:15:99:1c:d2:47:94:fd:57:
         5d:da:77:fa:6d:6e:fd:fb:74:11:69:3f:45:5b:0f:15:0c:4c:
         6a:dd:32:62:b6:04:9b:aa
`;
 */