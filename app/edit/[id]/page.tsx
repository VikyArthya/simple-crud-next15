import EditForm from "@/components/edit-form";
import { getImagesById } from "@/lib/data";
import { notFound } from "next/navigation";

interface EditPageProps {
  params: { id?: string }; // id bisa undefined untuk menghindari error
}

const EditPage = async ({ params }: EditPageProps) => {
  if (!params?.id) {
    return notFound(); // Jika params.id tidak ada, redirect ke 404
  }

  try {
    const data = await getImagesById(params.id);
    if (!data) return notFound(); // Jika data tidak ditemukan, redirect ke 404

    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="bg-white rounded-sm shadow p-8">
          <h1 className="text-2xl font-bold mb-5">Update Image</h1>
          <EditForm data={data} />
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching image:", error);
    return notFound(); // Jika terjadi error di fetch data, redirect ke 404
  }
};

export default EditPage;
