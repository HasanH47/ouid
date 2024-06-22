const fs = require("fs");
const mysql = require("mysql");
const { ouid } = require("./index");

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL");
});

const createTableQuery = `
  CREATE TABLE IF NOT EXISTS ids (
    id VARCHAR(26) PRIMARY KEY
  )
`;

connection.query(createTableQuery, (err) => {
  if (err) {
    console.error("Error creating table:", err);
    connection.end();
    return;
  }
  console.log("Table created or already exists");

  const iterations = 100000; // Number of IDs to generate
  const batchSize = 1000; // Number of IDs per batch
  const performanceData = [];

  const insertIDBatch = (batch) => {
    return new Promise((resolve, reject) => {
      const query = "INSERT INTO ids (id) VALUES ?";
      const values = batch.map((id) => [id]);
      connection.query(query, [values], (err) => {
        if (err) {
          if (err.code === "ER_DUP_ENTRY") {
            console.error(`Duplicate ID found in batch: ${batch}`);
          }
          return reject(err);
        }
        resolve();
      });
    });
  };

  const testLoad = async () => {
    console.log(`Starting load test with ${iterations} iterations`);

    for (let i = 0; i < iterations; i += batchSize) {
      const batch = [];
      for (let j = 0; j < batchSize; j++) {
        batch.push(ouid());
      }

      const startTime = Date.now();
      try {
        await insertIDBatch(batch);
        const endTime = Date.now();
        performanceData.push({
          batch: i / batchSize + 1,
          time: endTime - startTime,
        });
      } catch (err) {
        console.error(`Error inserting batch at iteration ${i}:`, err);
      }
    }

    fs.writeFileSync(
      "performanceData.json",
      JSON.stringify(performanceData, null, 2)
    );
    connection.end();
    console.log("Load test completed");
  };

  testLoad();
});
