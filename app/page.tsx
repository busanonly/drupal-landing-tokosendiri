// app/page.tsx

import { drupal } from "../lib/drupal";
import Image from "next/image";
import { NEXT_PUBLIC_DRUPAL_BASE_URL } from "../lib/drupal";
import Link from "next/link";

interface Article {
  id: string;
  title: string;
  body?: {
    value: string;
    processed: string;
  };
  field_image?: {
    url: string;
    alt: string;
    width: number;
    height: number;
  };
  path?: {
    alias: string;
  };
}

export default async function Home() {
  let articles: Article[] = [];
  let error: string | null = null;

  try {
    const response = await drupal.getResourceCollection("node--article", {
      params: {
        "filter[status]": 1,
        include: "field_image",
        "fields[node--article]": "title,body,path,field_image",
        "fields[file--file]": "uri,url,filename,resourceId",
        sort: "-created",
      },
    });

    articles = response.map((article: any) => ({
      id: article.id,
      title: article.title,
      body: article.body,
      path: article.path,
      field_image: article.field_image
        ? {
            url: article.field_image.url || (article.field_image.uri ? `${NEXT_PUBLIC_DRUPAL_BASE_URL}${article.field_image.uri.url}` : undefined),
            alt: article.field_image.resourceId?.meta?.alt || article.field_image.filename || article.title,
            width: article.field_image.resourceId?.meta?.width || 0,
            height: article.field_image.resourceId?.meta?.height || 0,
          }
        : undefined,
    }));
  } catch (err: any) {
    console.error("Gagal mengambil artikel dari Drupal:", err);
    error = "Gagal mengambil data dari Drupal. Pastikan Drupal berjalan dan CORS dikonfigurasi dengan benar.";
    if (err.response?.status === 401) {
      error += " (Autentikasi gagal. Pastikan DRUPAL_API_USERNAME dan DRUPAL_API_PASSWORD benar)";
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Artikel Terbaru dari Toko Sendiri</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}

      {articles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <div key={article.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              {article.field_image?.url && (
                <div className="relative w-full h-48">
                  <Image
                    src={article.field_image.url}
                    alt={article.field_image.alt || article.title}
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              )}
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{article.title}</h2>
                {article.body && (
                  <div
                    className="text-gray-700 text-sm mb-4 line-clamp-3"
                    dangerouslySetInnerHTML={{ __html: article.body.processed }}
                  />
                )}
                {article.path?.alias && (
                  <Link href={article.path.alias} className="text-blue-600 hover:underline">
                    Baca Selengkapnya
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        !error && <p>Tidak ada artikel yang ditemukan dari Drupal.</p>
      )}
    </div>
  );
}