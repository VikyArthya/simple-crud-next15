import { prisma } from "@/lib/prisma";

export const getImages = async () => {
  try {
    const result = await prisma.upload.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return result;
  } catch (error) {
    console.error("Error fetching data from database:", error);
    throw new Error("Failed to fetch data from database");
  }
};

export const getImagesById = async (id: string) => {
  console.log("Fetching image with ID:", id);
  try {
    const result = await prisma.upload.findUnique({
      where: { id },
    });
    return result;
  } catch (error) {
    console.error("Error fetching data from database:", error);
    throw new Error("Failed to fetch data from database");
  }
};
