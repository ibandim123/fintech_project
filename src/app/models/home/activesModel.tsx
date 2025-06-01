import axios from "axios";

export async function SearchActiveId(id: number | null) {
  const response = await axios
    .get(`http://localhost:3001/actives/${id}`)
    .then((response) => response)
    .catch((error) => error);

  return response;
}
