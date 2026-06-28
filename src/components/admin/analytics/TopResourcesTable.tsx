"use client";

interface Resource {
  id: string;
  title: string;
  faculty_name: string;
  downloads?: number;
  views?: number;
  created_at?: string;
}

interface Props {
  title: string;
  type: "downloads" | "views" | "recent";
  data: Resource[];
}

export default function TopResourcesTable({
  title,
  type,
  data,
}: Props) {

  return (

    <div className="rounded-2xl bg-white p-6 shadow">

      <h2 className="mb-6 text-xl font-bold">
        {title}
      </h2>

      <div className="overflow-x-auto">

        <table className="w-full">

          <thead>

            <tr className="border-b">

              <th className="py-3 text-left">
                Resource
              </th>

              <th className="text-left">
                Faculty
              </th>

              <th className="text-right">

                {type === "downloads"
                  ? "Downloads"
                  : type === "views"
                  ? "Views"
                  : "Uploaded"}

              </th>

            </tr>

          </thead>

          <tbody>

            {data.map((item) => (

              <tr
                key={item.id}
                className="border-b"
              >

                <td className="py-4">

                  {item.title}

                </td>

                <td>

                  {item.faculty_name}

                </td>

                <td className="text-right">

                  {type === "downloads" &&
                    item.downloads}

                  {type === "views" &&
                    item.views}

                  {type === "recent" &&
                    new Date(
                      item.created_at!
                    ).toLocaleDateString()}

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>

  );

}