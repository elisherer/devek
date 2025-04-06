import { useNavigate } from "react-router";

import CryptoCert from "./CryptoCert";
import CryptoCipher from "./CryptoCipher";
import CryptoGenerate from "./CryptoGenerate";
import CryptoHash from "./CryptoHash";
import CryptoSign from "./CryptoSign";
import { useStore } from "./PageCrypto.store";

const pageRoutes = ["hash", "cipher", "sign", "generate", "cert"];
const pages = [CryptoHash, CryptoCipher, CryptoSign, CryptoGenerate, CryptoCert];

const PageCrypto = ({ location }) => {
  const pathSegments = location.pathname.substr(1).split("/");
  const type = pathSegments[1];
  const navigate = useNavigate();
  if (!pageRoutes.includes(type || "")) {
    navigate("/" + pathSegments[0] + "/" + pageRoutes[0]);
    return;
  }

  const state = useStore();
  const CryptoSubPage = pages[pageRoutes.indexOf(type)];
  return <CryptoSubPage {...state[type]} />;
};

export default PageCrypto;
