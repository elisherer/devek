import { Redirect } from "react-router-dom";
import { useStore } from "./PageCrypto.store";

import CryptoHash from "./CryptoHash";
import CryptoCert from "./CryptoCert";
import CryptoCipher from "./CryptoCipher";
import CryptoSign from "./CryptoSign";
import CryptoGenerate from "./CryptoGenerate";

const pageRoutes = ["hash", "cipher", "sign", "generate", "cert"];
const pages = [CryptoHash, CryptoCipher, CryptoSign, CryptoGenerate, CryptoCert];

const PageCrypto = ({ location }: { location: Object }) => {
  const pathSegments = location.pathname.substr(1).split("/");
  const type = pathSegments[1];
  if (!pageRoutes.includes(type || "")) {
    return <Redirect to={"/" + pathSegments[0] + "/" + pageRoutes[0]} />;
  }

  const state = useStore();
  const CryptoSubPage = pages[pageRoutes.indexOf(type)];
  return <CryptoSubPage {...state[type]} />;
};

export default PageCrypto;
