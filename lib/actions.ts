"use server";
import { z } from "zod";
import { put, del } from "@vercel/blob";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getImagesById } from "./data";

const UploadSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  image: z
    .instanceof(File)
    .refine((file) => file.size > 0, { message: "Image is required" })
    .refine((file) => file.size === 0 || file.type.startsWith("image/"), { message: "Only image are allowed" })
    .refine((file) => file.size < 4000000, { message: "File size should be less than 4MB" }),
});

const EditSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  image: z
    .instanceof(File)
    .refine((file) => file.size === 0 || file.type.startsWith("image/"), { message: "Only image are allowed" })
    .refine((file) => file.size < 4000000, { message: "File size should be less than 4MB" })
    .optional(),
});

export const uploadImage = async (prevState: unknown, formData: FormData) => {
  const validatedFields = UploadSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!validatedFields.success) {
    return { error: validatedFields.error.flatten().fieldErrors };
  }

  const { title, image } = validatedFields.data;
  const { url } = await put(image.name, image, { access: "public", multipart: true });

  try {
    await prisma.upload.create({
      data: { title, image: url },
    });
  } catch (error) {
    console.error("Error creating data:", error);
    return { error: "Failed to create data" };
  }

  revalidatePath("/");
  redirect("/");
};

//UpdateImage

export const updateImage = async (id: string, prevState: unknown, formData: FormData) => {
  const validatedFields = EditSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!validatedFields.success) {
    return { error: validatedFields.error.flatten().fieldErrors };
  }

  const data = await getImagesById(id);
  if (!data) return { message: "Image not found" };

  const { title, image } = validatedFields.data;
  let imagePath;
  if (!image || image.size <= 0) {
    imagePath = data.image;
  } else {
    await del(data.image);
    const { url } = await put(image.name, image, { access: "public", multipart: true });
    imagePath = url;
  }

  try {
    await prisma.upload.update({
      data: { title, image: imagePath },
      where: { id },
    });
  } catch (error) {
    console.error("Error update data:", error);
    return { error: "Failed to update data" };
  }

  revalidatePath("/");
  redirect("/");
};

//Delete Image
export const deleteImage = async (id: string) => {
  const data = await getImagesById(id);
  if (!data) return { message: "Image not found" };

  await del(data.image);
  try {
    await prisma.upload.delete({ where: { id } });
  } catch (error) {
    console.error("Error deleting data:", error);
    return { message: "Failed to delete data" };
  }
  revalidatePath("/");
};
