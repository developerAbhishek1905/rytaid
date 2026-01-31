import fs from "fs";

const data = JSON.parse(
  fs.readFileSync("./pincodes.json", "utf8")
);

const cleaned = data.map(item => ({
  pincode_id: item.id ? Number(item.id) : null,
  pincode: item.pincode ?? null,
  city_id: item.city_id ? Number(item.city_id) : null
}));

console.log("SAMPLE:", cleaned.slice(0, 3));

fs.writeFileSync(
  "./pincodes_clean.json",
  JSON.stringify(cleaned, null, 2)
);

console.log("✅ pincodes_clean.json generated");
