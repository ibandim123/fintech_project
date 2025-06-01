import { SearchActiveId } from "@/app/models/home/activesModel";

export async function handleSearchActiveId(id: number | null) {
  try {
    const response = await SearchActiveId(id);

    if (response.status === 200) {
      return response.data;
    } else {
      return {
        message: response?.response?.data.error,
        cause: response?.response?.data.cause,
      };
    }
  } catch (Exception) {
    console.log(Exception);
  }
}
