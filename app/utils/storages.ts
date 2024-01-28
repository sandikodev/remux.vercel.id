import fs from "fs/promises";

const file_dir = "data.json";

export type Person = {
  id: number;
  fName: string;
  lName: string;
};

export type People = Array<Person>;

export async function getData() {
  const rawFileContent = await fs.readFile(file_dir, "utf8");
  const data = JSON.parse(rawFileContent);
  const stored = data.people as People;
  return stored;
}

export async function updateData(people: People) {
  return fs.writeFile(file_dir, JSON.stringify({ people: people || [] }));
}
