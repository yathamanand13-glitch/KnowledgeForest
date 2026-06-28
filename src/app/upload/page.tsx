"use client";

import { useEffect, useState } from "react";

import FacultyLayout from "@/components/faculty/FacultyLayout";
import { supabase } from "@/lib/supabase";
import { useRouter }
from "next/navigation";

import {
  IKUpload,
  IKContext
} from "imagekitio-react";

import {
  Upload,
  Image as ImageIcon,
} from "lucide-react";

async function getOrCreateCollege(
  collegeName: string
) {
  if (!collegeName) return null;

  // CHECK EXISTING

  const { data: existingCollege } =
    await supabase
      .from("colleges")
      .select("id")
      .ilike("name", collegeName)
      .single();

  if (existingCollege) {
    return existingCollege.id;
  }

  // CREATE NEW

  const { data: newCollege, error } =
    await supabase
      .from("colleges")
      .insert([
        {
          name: collegeName,
        },
      ])
      .select("id")
      .single();

  if (error) {
    console.error(error);
    return null;
  }

  return newCollege.id;
}

async function getOrCreateSubject(
  subjectName: string,
  collegeId?: string | null,
  semester?: string,
  subjectCode?: string,
  course?: string,
  regulation?: string
) {

  if (!subjectName) return null;

  const semesterNumber =
    semester
      ? Number(
          semester.replace(/\D/g, "")
        )
      : null;

  // CHECK EXISTING SUBJECT

  const { data: existingSubject } =
    await supabase
      .from("subjects")
      .select("id")
      .ilike(
        "subject_name",
        subjectName.trim()
      )
      .eq(
        "college_id",
        collegeId
      )
      .eq(
        "semester",
        semesterNumber
      )
      .maybeSingle();

  if (existingSubject) {

    return existingSubject.id;

  }

  // CREATE SUBJECT

  const { data: newSubject, error } =
    await supabase
      .from("subjects")
      .insert([
        {
  subject_name: subjectName.trim(),

  subject_code: subjectCode,

  course: course,

  regulation: regulation,

  semester: semesterNumber,

  college_id: collegeId,
},
      ])
      .select("id")
      .single();

  if (error) {

    console.error(error);

    return null;

  }

  // Increase subject count of college

if (collegeId) {

  const { data: college } =
    await supabase
      .from("colleges")
      .select("subject_count")
      .eq("id", collegeId)
      .single();

  await supabase
    .from("colleges")
    .update({
      subject_count:
        (college?.subject_count || 0) + 1,
    })
    .eq("id", collegeId);

}

  return newSubject.id;
}

interface College {
  id: string;
  name: string;
  college_code?: string;
}

interface Subject {
  id: string;
  subject_name: string;
  subject_code?: string;
  course?: string;
  regulation?: string;
}

interface Faculty {
  id: string;
  faculty_name: string;
}

export default function UploadPage() {

  const [dragging, setDragging] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

    const [
  canUpload,
  setCanUpload
] = useState(false);

const [
  approvalStatus,
  setApprovalStatus
] = useState("pending");

    const [pdfUploading, setPdfUploading] =
  useState(false);

const [
  thumbnailUploading,
  setThumbnailUploading
] = useState(false);

  // Uploaded URLs
  const [
    uploadedFileUrl,
    setUploadedFileUrl
  ] = useState("");

  const [
  uploadedFileType,
  setUploadedFileType
] = useState("");

  const [
    uploadedThumbnailUrl,
    setUploadedThumbnailUrl
  ] = useState("");

  const [
  uploadedFileId,
  setUploadedFileId,
] = useState("");

const [
  uploadedThumbnailId,
  setUploadedThumbnailId,
] = useState("");

  // Form States
  const [title, setTitle] =
    useState("");

  const [
    description,
    setDescription
  ] = useState("");

  const [tags, setTags] =
    useState("");

  const [semester, setSemester] =
    useState("Semester 1");

  const [
    resourceType,
    setResourceType
  ] = useState("Notes");

  // Dynamic Dropdown Data
  const [colleges, setColleges] =
    useState<College[]>([]);

  const [subjects, setSubjects] =
    useState<Subject[]>([]);

  const [faculties, setFaculties] =
    useState<Faculty[]>([]);

  // Selected Values
  const [
    selectedCollege,
    setSelectedCollege
  ] = useState("");

  const [
    selectedSubject,
    setSelectedSubject
  ] = useState("");

  const [subjectCode, setSubjectCode] = useState("");

const [course, setCourse] = useState("");

const [regulation, setRegulation] = useState("");

  const [
    selectedFaculty,
    setSelectedFaculty
  ] = useState("");

  const router =
  useRouter();

  // ImageKit Auth
  const authenticator =
    async () => {

    try {

      const response =
        await fetch(
          "/api/upload-auth"
        );

      if (!response.ok) {

        throw new Error(
          "Authentication failed"
        );
      }

      return await response.json();

    } catch (error) {

      console.error(error);

      throw new Error(
        "Authentication failed"
      );
    }
  };

  // Fetch Dynamic Data
  useEffect(() => {

    const fetchData =
      async () => {

      const {
        data: collegesData
      } = await supabase
        .from("colleges")
        .select("*");

      const {
        data: subjectsData
      } = await supabase
        .from("subjects")
        .select("*");

      const {
        data: facultiesData
      } = await supabase
        .from("faculties")
        .select("*");

      if (collegesData) {
        setColleges(collegesData);
      }

      if (subjectsData) {
        setSubjects(subjectsData);
      }

      if (facultiesData) {
        setFaculties(facultiesData);
      }
    };

    fetchData();

  }, []);

  useEffect(() => {

  const checkAuth =
    async () => {

      const {
        data: { session }
      } =
        await supabase.auth.getSession();

      if (!session) {

        router.replace(
          "/login"
        );
      }

      if (session?.user?.email) {

  const { data: faculty } =
    await supabase
      .from("faculties")
      .select(
        "can_upload, approval_status"
      )
      .eq(
        "email",
        session.user.email
      )
      .single();

  if (faculty) {

    setCanUpload(
      faculty.can_upload
    );

    setApprovalStatus(
      faculty.approval_status
    );

    if (!faculty.can_upload) {

  router.replace("/dashboard");

  return;

}
  }
}
    };

  checkAuth();

}, []);

  // Upload Handler
  const handleUpload =
    async () => {

    if (
      !uploadedFileUrl
    ) {

      alert(
        "Please upload file first."
      );

      return;
    }

    if (
      !uploadedThumbnailUrl
    ) {

      alert(
        "Please upload thumbnail."
      );

      return;
    }

 if (
  !title ||
  !selectedSubject ||
  !selectedCollege ||
  !selectedFaculty ||
  !semester ||
  !subjectCode ||
  !course ||
  !regulation ||
  !resourceType
) {
  alert(
    "Please fill all required (*) fields."
  );
  return;
}

    setLoading(true);

    try {

      const {
  data: { session },
} = await supabase.auth.getSession();

const { data: facultyData } =
  await supabase
    .from("faculties")
    .select(
      "id, can_upload, approval_status, uploads_count"
    )
    .eq(
      "email",
      session?.user?.email
    )
    .single();

    if (!facultyData) {

  alert(
    "Faculty account not found."
  );

  setLoading(false);

  return;
}

if (
  !facultyData.can_upload
) {

  alert(
    "Your account is awaiting admin approval. Upload access is currently disabled."
  );

  setLoading(false);

  return;
}

      const collegeId =
  await getOrCreateCollege(
    selectedCollege
  );

const subjectId =
  await getOrCreateSubject(
    selectedSubject,
    collegeId,
    semester,
    subjectCode,
    course,
    regulation
  );

  const slug =
  `${title
    .toLowerCase()
    .trim()
    .replace(
      /[^a-z0-9\s-]/g,
      ""
    )
    .replace(/\s+/g, "-")
  }-${Date.now()}`;

    const { data: duplicate } =
  await supabase
    .from("resources")
    .select("id")
    .eq("slug", slug)
    .eq(
      "subject_name",
      selectedSubject
    )
    .eq(
      "semester",
      semester
    )
    .maybeSingle();

if (duplicate) {

  alert(
    "This resource already exists."
  );

  setLoading(false);

  return;
}

const normalizedTags =
  tags
    .split(",")
    .map((tag) =>
      tag.trim().toLowerCase()
    )
    .filter(Boolean);

      const { error } =
        await supabase
          .from("resources")
          .insert([
            {

              title,

              slug,

              description,

              resource_type:
                resourceType,

              file_url:
                uploadedFileUrl,

              file_type: uploadedFileType,

              thumbnail_url:
                uploadedThumbnailUrl,

              imagekit_file_id:
                uploadedFileId,

              imagekit_thumbnail_id:
                uploadedThumbnailId,

              downloads: 0,

              rating: 0,

              hash:
                crypto.randomUUID(),

              status:
                "pending",

              tags: normalizedTags,

              semester,

              subject_id: subjectId,

college_id: collegeId,

uploaded_by: facultyData?.id,

subject_name: selectedSubject,

college_name: selectedCollege,

faculty_name: selectedFaculty,

            },
          ]);

          if (!error && subjectId) {

  const { data: subject } =
    await supabase
      .from("subjects")
      .select("resource_count")
      .eq("id", subjectId)
      .single();

  await supabase
    .from("subjects")
    .update({
      resource_count:
        (subject?.resource_count || 0) + 1,
    })
    .eq("id", subjectId);

}

if (error) {

  console.log(error);

  alert(error.message);

} else {

  // Increase college resource count

  if (collegeId) {

    await supabase.rpc(
      "increment_college_resource_count",
      {
        college_id_input: collegeId,
      }
    );

  }

   await supabase

    .from("faculties")

    .update({

      uploads_count:
        (facultyData.uploads_count || 0) + 1,

    })

    .eq(
      "id",
      facultyData.id
    );

  alert(
    "Resource uploaded successfully!"
  );

  // Reset

  setTitle("");
  setDescription("");
  setTags("");

  setSemester(
    "Semester 1"
  );

  setResourceType(
    "Notes"
  );

  setSelectedCollege("");
  setSelectedSubject("");
  setSelectedFaculty("");

  setUploadedFileUrl("");
  setUploadedThumbnailUrl("");
  setUploadedFileId("");

  setUploadedThumbnailId("");

}

    } catch (err) {

      console.log(err);

      alert(
        "Something went wrong."
      );
    }

    setLoading(false);
  };

  return (

  <IKContext

    publicKey={
      process.env
        .NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!
    }

    urlEndpoint={
      process.env
        .NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!
    }

    authenticator={authenticator}
  >

    <FacultyLayout>

      <main className="min-h-screen bg-[#DCE3CC] p-6 md:p-10">

        {!canUpload && (

  <div className="mb-8 rounded-2xl border border-yellow-300 bg-yellow-50 p-5">

    <h3 className="text-lg font-semibold text-yellow-800">

      Account Approval Pending

    </h3>

    <p className="mt-2 text-yellow-700">

      Your faculty account has been verified,
      but resource upload access is waiting
      for admin approval.

    </p>

  </div>

)}

        <div className="mb-10">

          <h1 className="text-4xl font-bold text-[#1F2937]">
            Upload Resource
          </h1>

          <p className="mt-2 text-gray-600">
            Share notes, PDFs and academic resources.
          </p>

        </div>

        <div className="grid gap-8 lg:grid-cols-3">

          {/* LEFT */}
          <div className="space-y-6 lg:col-span-2">

            {/* FILE UPLOAD */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}

              onDragLeave={() =>
                setDragging(false)
              }

              onDrop={(e) => {
                e.preventDefault();
                setDragging(false);
              }}

              className={`rounded-3xl border-2 border-dashed p-10 text-center transition ${
                dragging
                  ? "border-[#355E3B] bg-[#E7F0E8]"
                  : "border-gray-300 bg-white"
              }`}
            >

              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#E7F0E8]">

                <Upload className="h-10 w-10 text-[#355E3B]" />

              </div>

              <h2 className="mt-6 text-2xl font-semibold">

                Upload Resource

              </h2>

              <p className="mt-2 text-gray-500">

                Upload PDFs, DOCX, PPT, XLS and academic resources.

              </p>
<div className="mt-6">

  <IKUpload

    id="pdf-upload"

    style={{ display: "none" }}

    fileName="resource-file"

    useUniqueFileName={true}

    folder="/knowledgeforest/resources"

    accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx"

    authenticator={authenticator}

    validateFile={(file: File) => {

      const extension =
  file.name
    .split(".")
    .pop()
    ?.toLowerCase() || "";

setUploadedFileType(extension);

      const allowedTypes = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];

if (!allowedTypes.includes(file.type)) {

  alert(
    "Only PDF, DOC, DOCX, PPT, PPTX, XLS and XLSX files are allowed."
  );

  return false;
}

  if (
    file.size >
    20 * 1024 * 1024
  ) {

    alert(
      "PDF size must be below 20MB"
    );

    return false;
  }

  return true;
}}

    onUploadStart={() => {

      setPdfUploading(true);

    }}

    onSuccess={async (res: any) => {

      console.log(res);

      setUploadedFileUrl(
        res.url
      );

      setUploadedFileId(
    res.fileId
  );

      setPdfUploading(false);


      alert(
        "File uploaded successfully!"
      );

    }}

    onError={(err: any) => {

      setPdfUploading(false);

      console.log(err);

      setPdfUploading(false);

      alert(
        "File upload failed."
      );
    }}

  />

 <button
  type="button"
  disabled={!canUpload}
  onClick={() => {

    if (!canUpload) return;

    const input =
      document.getElementById(
        "pdf-upload"
      ) as HTMLElement;

    input?.click();

  }}
  className={`rounded-2xl px-6 py-3 font-semibold text-white

${
  canUpload
    ? "bg-[#355E3B]"
    : "cursor-not-allowed bg-gray-400"
}`}
>

  {pdfUploading
    ? "Uploading..."
    : !canUpload
    ? "Locked"
    : "Upload File"}

</button>

  {uploadedFileUrl && (

    <div className="mt-4">

      <p className="text-sm font-semibold text-green-700">

        File Uploaded Successfully

      </p>

      <button
        type="button"

        onClick={() =>
          setUploadedFileUrl("")
        }
        className="mt-2 rounded-xl bg-red-500 px-4 py-2 text-white"
      >

        Remove File

      </button>

    </div>
  )}

</div>

            </div>

            {/* FORM */}
            <div
className={`rounded-3xl bg-white p-8 shadow-sm

${
!canUpload
? "pointer-events-none opacity-60"
: ""
}
`}
>

              <div className="grid gap-6 md:grid-cols-2">

                <div className="md:col-span-2">

                  <label className="mb-2 block text-sm font-semibold">
  Resource Title
  <span className="text-red-500">*</span>
</label>

                  <input
                    type="text"
                    value={title}
                    onChange={(e) =>
                      setTitle(
                        e.target.value
                      )
                    }
                    placeholder="Enter title"
                    className="w-full rounded-2xl border border-gray-200 bg-[#F8FAF5] p-4 outline-none"
                  />
                </div>

                {/* Subject */}
                <div>

                  <label className="mb-2 block text-sm font-semibold">
  Subject
  <span className="text-red-500">*</span>
</label>

                  <input
                    list="subjects-list"
                    value={selectedSubject}
                    onChange={(e) =>
                      setSelectedSubject(
                        e.target.value
                      )
                    }
                    placeholder="Select subject"
                    className="w-full rounded-2xl border border-gray-200 bg-[#F8FAF5] p-4 outline-none"
                  />

                  <datalist id="subjects-list">

                    {subjects.map((subject) => (

                      <option
                        key={subject.id}
                        value={subject.subject_name}
                      />
                    ))}

                  </datalist>

                </div>

                {/* Subject Code */}
<div>

  <label className="mb-2 block text-sm font-semibold">
    Subject Code
    <span className="text-red-500">*</span>
  </label>

  <input
    type="text"
    value={subjectCode}
    onChange={(e) =>
      setSubjectCode(e.target.value)
    }
    placeholder="DBMS301"
    className="w-full rounded-2xl border border-gray-200 bg-[#F8FAF5] p-4 outline-none"
  />

</div>

                {/* College */}
                <div>

                  <label className="mb-2 block text-sm font-semibold">
  College
  <span className="text-red-500">*</span>
</label>

                  <input
                    list="colleges-list"
                    value={selectedCollege}
                    onChange={(e) =>
                      setSelectedCollege(
                        e.target.value
                      )
                    }
                    placeholder="Select college"
                    className="w-full rounded-2xl border border-gray-200 bg-[#F8FAF5] p-4 outline-none"
                  />

                  <datalist id="colleges-list">

                    {colleges.map((college) => (

                      <option
                        key={college.id}
                        value={college.name}
                      />
                    ))}

                  </datalist>

                </div>

                {/* Course */}
<div>

  <label className="mb-2 block text-sm font-semibold">
    Course
    <span className="text-red-500">*</span>
  </label>

  <select
    value={course}
    onChange={(e) =>
      setCourse(e.target.value)
    }
    className="w-full rounded-2xl border border-gray-200 bg-[#F8FAF5] p-4 outline-none"
  >

    <option value="">
      Select Course
    </option>

    <option value="CSE">CSE</option>
    <option value="ECE">ECE</option>
    <option value="EEE">EEE</option>
    <option value="MECH">MECH</option>
    <option value="CIVIL">CIVIL</option>
    <option value="IT">IT</option>

  </select>

</div>

                {/* Faculty */}
                <div>

                  <label className="mb-2 block text-sm font-semibold">
  Faculty
  <span className="text-red-500">*</span>
</label>

                  <input
                    list="faculties-list"
                    value={selectedFaculty}
                    onChange={(e) =>
                      setSelectedFaculty(
                        e.target.value
                      )
                    }
                    placeholder="Select faculty"
                    className="w-full rounded-2xl border border-gray-200 bg-[#F8FAF5] p-4 outline-none"
                  />

                  <datalist id="faculties-list">

                    {faculties.map((faculty) => (

                      <option
                        key={faculty.id}
                        value={faculty.faculty_name}
                      />
                    ))}

                  </datalist>

                </div>

                {/* Semester */}
                <div>

                  <label className="mb-2 block text-sm font-semibold">
  Semester
  <span className="text-red-500">*</span>
</label>

                  <select
                    value={semester}
                    onChange={(e) =>
                      setSemester(
                        e.target.value
                      )
                    }
                    className="w-full rounded-2xl border border-gray-200 bg-[#F8FAF5] p-4 outline-none"
                  >

                    <option>Semester 1</option>
                    <option>Semester 2</option>
                    <option>Semester 3</option>
                    <option>Semester 4</option>
                    <option>Semester 5</option>
                    <option>Semester 6</option>
                    <option>Semester 7</option>
                    <option>Semester 8</option>

                  </select>

                </div>

                {/* Regulation */}
<div>

  <label className="mb-2 block text-sm font-semibold">
    Regulation
    <span className="text-red-500">*</span>
  </label>

  <input
    type="text"
    value={regulation}
    onChange={(e) =>
      setRegulation(e.target.value)
    }
    placeholder="R23"
    className="w-full rounded-2xl border border-gray-200 bg-[#F8FAF5] p-4 outline-none"
  />

</div>

                {/* Resource Type */}
                <div className="md:col-span-2">

                  <label className="mb-2 block text-sm font-semibold">
  Resource Type
  <span className="text-red-500">*</span>
</label>

                  <select
                    value={resourceType}
                    onChange={(e) =>
                      setResourceType(
                        e.target.value
                      )
                    }
                    className="w-full rounded-2xl border border-gray-200 bg-[#F8FAF5] p-4 outline-none"
                  >

                    <option>Notes</option>
                    <option>Question Paper</option>
                    <option>Lab Manual</option>
                    <option>Assignment</option>
                    <option>Presentation</option>

                  </select>

                </div>

                {/* Tags */}
                <div className="md:col-span-2">

                  <label className="mb-2 block text-sm font-semibold">

                    Tags

                  </label>

                  <input
                    type="text"
                    value={tags}
                    onChange={(e) =>
                      setTags(
                        e.target.value
                      )
                    }
                    placeholder="dbms, os, java"
                    className="w-full rounded-2xl border border-gray-200 bg-[#F8FAF5] p-4 outline-none"
                  />

                </div>

                {/* Description */}
                <div className="md:col-span-2">

                  <label className="mb-2 block text-sm font-semibold">

                    Description

                  </label>

                  <textarea
                    rows={5}
                    value={description}
                    onChange={(e) =>
                      setDescription(
                        e.target.value
                      )
                    }
                    placeholder="Write description..."
                    className="w-full rounded-2xl border border-gray-200 bg-[#F8FAF5] p-4 outline-none"
                  />

                </div>

              </div>

            </div>

          </div>

          {/* RIGHT */}
          <div className="space-y-6">

            {/* THUMBNAIL */}
            <div className="rounded-3xl bg-white p-6 shadow-sm">

              <h2 className="text-xl font-semibold">

                Thumbnail

              </h2>

              <div className="mt-6 rounded-2xl border-2 border-dashed border-gray-300 bg-[#F8FAF5] p-4">

                {uploadedThumbnailUrl ? (

                  <img
                    src={uploadedThumbnailUrl}
                    alt="Thumbnail"
                    className="h-56 w-full rounded-2xl object-cover"
                  />

                ) : (

                  <div className="flex h-56 items-center justify-center">

                    <div className="text-center">

                      <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />

                      <p className="mt-3 text-sm text-gray-500">

                        Upload preview image

                      </p>

                    </div>

                  </div>
                )}

                <div className="mt-4">

  <IKUpload

    id="thumbnail-upload"

   style={{ display: "none" }}

    fileName="thumbnail-image.jpg"

    useUniqueFileName={true}

    folder="/knowledgeforest/thumbnails"

    accept=".jpg,.jpeg,.png,.webp"

    authenticator={authenticator}

    validateFile={(file: File) => {

  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/jpg"
  ];

  if (
    !allowedTypes.includes(
      file.type
    )
  ) {

    alert(
      "Only JPG, PNG, and WEBP images are allowed."
    );

    return false;
  }

  if (
    file.size >
    5 * 1024 * 1024
  ) {

    alert(
      "Thumbnail size must be below 5MB"
    );

    return false;
  }

  return true;
}}

    onUploadStart={() => {

      setThumbnailUploading(true);

    }}

    onSuccess={(res: any) => {

      console.log(res);

      setUploadedThumbnailUrl(
        res.url
      );

      setUploadedThumbnailId(
       res.fileId
      );

      setThumbnailUploading(false);

      alert(
        "Thumbnail uploaded successfully!"
      );

    }}

    onError={(err: any) => {

      console.log(err);

      setThumbnailUploading(false);

      alert(
        "Thumbnail upload failed."
      );
    }}

  />

  <button
type="button"

disabled={!canUpload}

onClick={() => {

  if (!canUpload) return;

  const input =
    document.getElementById(
      "thumbnail-upload"
    ) as HTMLElement;

  input?.click();

}}

className={`rounded-2xl px-6 py-3 font-semibold text-white

${
canUpload
? "bg-[#355E3B]"
: "cursor-not-allowed bg-gray-400"
}`}
>

{thumbnailUploading
? "Uploading..."
: !canUpload
? "Locked"
: "Upload Thumbnail"}

</button>

  {uploadedThumbnailUrl && (

    <div className="mt-4">

      <button
         type="button"

        onClick={() =>
          setUploadedThumbnailUrl("")
        }
        className="rounded-xl bg-red-500 px-4 py-2 text-white"
      >

        Remove Thumbnail

      </button>

    </div>
  )}

</div>


              </div>

            </div>

            {/* Upload Tips */}
            <div className="rounded-3xl bg-white p-6 shadow-sm">

              <h2 className="text-xl font-semibold">

                Upload Tips

              </h2>

              <ul className="mt-4 space-y-3 text-sm text-gray-600">

                <li>
                  • Upload readable PDFs.
                </li>

                <li>
                  • Use proper titles.
                </li>

                <li>
                  • Add useful tags.
                </li>

                <li>
                  • Avoid duplicates.
                </li>

              </ul>

            </div>

            {/* Upload Button */}
            <button
              onClick={handleUpload}
               disabled={
    loading ||
    !canUpload
  }
              className={`w-full rounded-2xl py-4 text-lg font-semibold text-white transition

${
  !canUpload
    ? "bg-gray-400 cursor-not-allowed"
    : "bg-[#355E3B] hover:scale-[1.02]"
}`}
            >

              {loading
  ? "Uploading..."
  : !canUpload
  ? "Awaiting Admin Approval"
  : "Upload Resource"}

            </button>

          </div>

        </div>

      </main>

    </FacultyLayout>

</IKContext>

  );
}