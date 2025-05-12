import { mysql } from "../../server.js";

export async function addInspiration(title, imageUrl) {
  const sql = "INSERT INTO inspiration (title, image_url) VALUES (?, ?)";
  const params = [title, imageUrl];
  return mysql.insert(sql, params);
}

export async function addInspirations(inspirations) {
  const sql = "INSERT INTO inspiration (title, image_url) VALUES ?";
  const params = [inspirations.map(({ title, imageUrl }) => [title, imageUrl])];
  return mysql.insert(sql, params);
}

export async function getInspirations(page, limit) {
  const offset = (page - 1) * limit;
  const sql = "SELECT title, image_url FROM inspiration LIMIT ? OFFSET ?";
  const params = [limit, offset];
  return mysql.select(sql, params);
}

export async function removeDuplicateTitles() {
  const sql =
    "DELETE i1 FROM inspiration i1 JOIN inspiration i2 ON i1.title = i2.title AND i1.id > i2.id";
  return mysql.delete(sql);
}
