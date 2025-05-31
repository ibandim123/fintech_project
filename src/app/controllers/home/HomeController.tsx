import {
  DeleteItem,
  EditItem,
  GetItem,
  CreateItem,
} from "@/app/models/home/homeModel";

export async function handleGetData() {
  try {
    const response = await GetItem();

    return response;
  } catch (Exception) {
    console.error("Erro ao buscar dados: ", Exception);
  }
}

export async function handleCreate(values: any) {
  try {
    const response = await CreateItem(values);

    return response;
  } catch (Exception) {
    console.error("Error ao buscar dados", Exception);
  }
}

export async function handleDelete(id: number | null) {
  try {
    const response = await DeleteItem(id);
    console.log(response);
  } catch (Exception) {
    console.log("Modal de Excerção", Exception);
  }
}

export async function handleEdit(values: any) {
  try {
    const response = await EditItem(values.id, values);
    console.log(response);
  } catch (Exception) {
    console.error("Erro ao editar dados: ", Exception);
  }
}
