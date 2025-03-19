import admin from "firebase-admin";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const serviceAccount = require("./firebase-admin-key.json");

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });

export default admin;

// import admin from "firebase-admin";
// import serviceAccount from "./firebase-admin-key.json" assert { type: "json" };
// admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });

// export default admin;
