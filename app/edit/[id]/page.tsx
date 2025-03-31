import EditForm from "@/components/edit-form";
import { getImagesById } from "@/lib/data";
import { notFound } from "next/navigation";

interface PageProps {
  params: { id: string }; // Pastikan `id` bertipe string, bukan opsional
}

const EditPage = async ({ params }: PageProps) => {
  const { id } = params; // Ambil ID dari params
  if (!id) return notFound(); // Pastikan ID ada

  const data = await getImagesById(id);
  if (!data) return notFound(); // Redirect jika tidak ada data

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="bg-white rounded-sm shadow p-8">
        <h1 className="text-2xl font-bold mb-5">Update Image</h1>
        <EditForm data={data} />
      </div>
    </div>
  );
};

export default EditPage;

// ✅ Tambahkan fungsi ini untuk mencegah error di build Next.js
export async function generateStaticParams() {
  return []; // Kosongkan agar Next.js tidak memproses halaman statis
}
