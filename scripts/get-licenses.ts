import fs from "node:fs";
import path from "node:path";

const packageJson = require("../package.json");
const licensePattern = /^(MIT|ISC|BSD.*|Apache-2\.0)$/;
const licenseFileNames = ["LICENSE", "LICENSE.md", "LICENSE.txt", "license", "license.md", "license.txt"];
const copyrightRegex = /Copyright[^\n]+/;

function fileExists(path: string) {
  try {
    fs.statSync(path);
    return true;
  } catch (err) {
    return false;
  }
}

function findLicenseFile(pack: any, folder: string) {
  let file = null;
  for (let i = 0; i < licenseFileNames.length; i++) {
    const licenseFile = path.join(folder, licenseFileNames[i]);
    if (fileExists(licenseFile)) {
      file = licenseFile;
      break;
    }
  }
  return file;
}

function getName(nameObject: any) {
  let name = "";
  if (typeof nameObject === "string") name += nameObject;
  else {
    if (nameObject.name) name += nameObject.name;
    if (nameObject.email) name += " (" + nameObject.email + ")";
    if (nameObject.url) name += " [" + nameObject.url + "]";
  }
  return name;
}

function getCopyrights(pack: any, folder: string) {
  const filePath = findLicenseFile(pack, folder);
  if (!filePath) {
    return null;
  }
  const licenseFileText = fs.readFileSync(filePath, "utf-8");
  const matches = copyrightRegex.exec(licenseFileText);
  if (matches) return matches[0];
  return licenseFileText.match(/^[^\r\n]+/); // first line
}

const result = Object.keys(packageJson.dependencies).reduce((result, packageName) => {
  result[packageName] = { version: packageJson.dependencies[packageName] };
  const folder = path.resolve(process.cwd(), "node_modules", packageName);
  const filename = path.resolve(folder, "package.json");
  if (!fileExists(filename)) {
    throw new Error(filename + " is not a file!");
  }
  const pack = require(filename);
  if (licensePattern.test(pack.license)) {
    result[packageName].license = pack.license;
    if (pack.author) {
      result[packageName].author = getName(pack.author);
    }
    if (Array.isArray(pack.maintainers)) {
      result[packageName].maintainers = pack.maintainers.map(getName);
    }
    const copyright = getCopyrights(pack, folder);
    if (copyright) {
      result[packageName].copyright = copyright;
    }
  }
  return result;
}, {});

export default result;
