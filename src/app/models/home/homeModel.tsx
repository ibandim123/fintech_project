import axios from "axios";

export async function CreateItem(values: any) {
  const response = await axios
    .post("http://localhost:3001/clients", values)
    .then((response) => response)
    .catch((error) => error);

  return response.data;
}

export async function GetItem() {
  const response = await axios
    .get("http://localhost:3001/clients")
    .then((response) => response)
    .catch((error) => error);

  return response.data;
}

export async function DeleteItem(id: number | null) {
  const response = await axios
    .delete(`http://localhost:3001/clients/${id}`)
    .then((response) => response)
    .catch((error) => error);

  return response.data;
}

export async function EditItem(id: number, values: any) {
  const response = await axios
    .put(`http://localhost:3001/clients/${id}`, values)
    .then((response) => response)
    .catch((error) => error);

  return response.data;
}
