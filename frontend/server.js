import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3000;

const folderArgIndex = process.argv.indexOf('--folder');
const folderPath =
  folderArgIndex !== -1 ? process.argv[folderArgIndex + 1] : 'public';

app.use(cors());
app.use(express.static(folderPath));

app.listen(PORT, () => {
  console.log(
    `FRONTEND listening on http://localhost:${PORT}, serving ${folderPath}`,
  );
});
