// Script to add all environment variables to Vercel
const { execSync } = require("child_process");

const vars = {
  NEXTAUTH_SECRET: "42iZgEQ1CGvNG4NxdasgA0RLo6iBiOZLa1I2Fxm+Tcw=",
  NEXTAUTH_URL: "https://tabacaria.vercel.app",
  NEXT_PUBLIC_APP_URL: "https://tabacaria.vercel.app",
  NEXT_PUBLIC_APP_NAME: "Oeste Tabacaria",
  NEXT_PUBLIC_WHATSAPP: "5518988176442",
  CLOUDINARY_CLOUD_NAME: "dwyrt2g1k",
  CLOUDINARY_API_KEY: "883982642416381",
  CLOUDINARY_API_SECRET: "wVhAOkz_DAeFoWwnz2xinUBpDeo",
  RESEND_API_KEY: "re_FkaBUGwa_8wMbwpmnhx92UFndD6r4E84B",
  RESEND_FROM_EMAIL: "Oeste Tabacaria <noreply@oestetabacaria.com.br>",
};

for (const [key, value] of Object.entries(vars)) {
  for (const env of ["production", "development"]) {
    try {
      execSync(
        `echo ${JSON.stringify(value)} | vercel env add ${key} ${env} --force`,
        { stdio: "pipe", shell: true }
      );
      console.log(`OK: ${key} -> ${env}`);
    } catch (e) {
      // Try alternative approach
      try {
        execSync(
          `node -e "process.stdout.write(${JSON.stringify(value)})" | vercel env add ${key} ${env} --force`,
          { stdio: "pipe", shell: true }
        );
        console.log(`OK (alt): ${key} -> ${env}`);
      } catch (e2) {
        console.log(`SKIP: ${key} -> ${env} (may already exist)`);
      }
    }
  }
}

console.log("\nDone! Verifying...");
execSync("vercel env ls", { stdio: "inherit" });
