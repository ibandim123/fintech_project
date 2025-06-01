import {
  DeleteItem,
  EditItem,
  GetItem,
  CreateItem,
} from "@/app/models/home/homeModel";

export async function handleGetData() {
  try {
    const response = await GetItem();

    if (response.status === 200) {
      return response.data;
    } else {
      return {
        message: response?.response?.data.error,
        cause: response?.response?.data.cause,
      };
    }
  } catch (Exception) {
    console.error("Erro ao buscar dados: ", Exception);
  }
}

export async function handleCreate(values: any) {
  try {
    const response = await CreateItem(values);

    if (response.status === 200) {
      return response.data;
    } else {
      return {
        message: response?.response?.data?.error,
        causa: response?.response?.data?.cause,
      };
    }
  } catch (Exception) {
    console.error("Error ao tentar criar novo item", Exception);
  }
}

export async function handleDelete(id: number | null) {
  try {
    const response = await DeleteItem(id);

    if (response.status === 200) {
      return response.data;
    } else {
      return {
        message: response?.response?.data?.error,
        causa: response?.response?.data.cause,
      };
    }
  } catch (Exception) {
    console.error("Não foi possível deletar item", Exception);
  }
}

export async function handleEdit(values: any) {
  try {
    const response = await EditItem(values.id, values);

    if (response.status === 200) {
      return response.data;
    } else {
      return {
        message: response?.response?.data?.error,
        cause: response?.response?.data?.cause,
      };
    }
  } catch (Exception) {
    console.error("Erro ao editar dados: ", Exception);
  }
}
