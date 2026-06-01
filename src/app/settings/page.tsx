"use client";

import {
  useState,
  useEffect,
} from "react";

import FacultyLayout from "@/components/faculty/FacultyLayout";

import { supabase } from "@/lib/supabase";

import {
  Camera,
  Mail,
  GraduationCap,
  Building2,
  User,
} from "lucide-react";

export default function SettingsPage() {
 const [faculty, setFaculty] =
  useState<any>(null);

const [loading, setLoading] =
  useState(true);

  useEffect(() => {

  fetchFaculty();

}, []);

async function fetchFaculty() {

  const {
    data: { session },
  } =
    await supabase.auth.getSession();

  if (!session?.user) {

    window.location.href =
      "/login";

    return;
  }

  const { data, error } =
    await supabase

      .from("faculties")

      .select("*")

      .eq(
        "email",
        session.user.email
      )

      .single();

  if (error) {

    console.log(error);

    return;
  }

  setFaculty(data);

  setLoading(false);
}

async function updateProfile(
  e: React.FormEvent
) {

  e.preventDefault();

  const {
    data: { session },
  } =
    await supabase.auth.getSession();

  if (!session?.user) return;

  const { error } =
    await supabase

      .from("faculties")

      .update({

  faculty_name:
    faculty.faculty_name,

  department:
    faculty.department,

  college_code:
    faculty.college_code,

  bio:
    faculty.bio,

  profile_photo_url:
    faculty.profile_photo_url,

  phone:
    faculty.phone,

  experience:
    faculty.experience,

  designation:
    faculty.designation,
})

      .eq(
        "email",
        session.user.email
      );

  if (error) {

    alert(error.message);

    return;
  }

  alert(
    "Profile updated successfully"
  );
}

 const handleImageUpload = async (
  e: React.ChangeEvent<HTMLInputElement>
) => {

  const file = e.target.files?.[0];

  if (!file) return;

  const fileName =
    `${Date.now()}-${file.name}`;

  const { error: uploadError } =
    await supabase.storage

      .from("faculty-profiles")

      .upload(
        fileName,
        file
      );

  if (uploadError) {

    alert(
      uploadError.message
    );

    return;
  }

  const {
    data: publicUrlData,
  } =
    supabase.storage

      .from("faculty-profiles")

      .getPublicUrl(fileName);

  setFaculty({

    ...faculty,

    profile_photo_url:
      publicUrlData.publicUrl,
  });
};

  if (loading) {

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#DCE3CC]">

      <div className="h-14 w-14 animate-spin rounded-full border-4 border-[#355E3B] border-t-transparent" />

    </div>
  );
}

  return (
    <FacultyLayout>
      <section className="px-6 py-16">
        
        <div className="mx-auto max-w-4xl">
          
          {/* Header */}
          <div className="mb-12">
            
            <h1 className="text-5xl font-bold text-[#1F2937]">
              Edit Profile
            </h1>

            <p className="mt-4 text-lg text-gray-600">
              Update your faculty profile and
              account information.
            </p>
          </div>

          {/* Form Card */}
          <div className="rounded-[32px] bg-white p-8 shadow-2xl">
            
            <form
  onSubmit={updateProfile}
  className="space-y-8"
>
              
              {/* Profile Upload */}
              <div className="flex flex-col items-center">
                
                <label className="relative cursor-pointer">
                  
                  <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-4 border-[#355E3B] bg-[#EEF2E6]">
                    
                    {faculty?.profile_photo_url ? (

  <img
    src={
      faculty.profile_photo_url
    }
    alt="Profile"
    className="h-full w-full object-cover"
  />

) : (

  <Camera
    className="text-[#355E3B]"
    size={42}
  />

)}
                  </div>

                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>

                <p className="mt-4 text-sm text-gray-500">
                  Change Profile Photo
                </p>
              </div>

              {/* Name */}
              <div>
                
                <label className="mb-3 block text-sm font-medium text-[#1F2937]">
                  Faculty Name
                </label>

                <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-[#F8FAF5] px-5 py-4">
                  
                  <User
                    className="text-[#355E3B]"
                    size={22}
                  />

                  <input
                    type="text"
                    value={
  faculty?.faculty_name || ""
}
onChange={(e) =>
  setFaculty({
    ...faculty,
    faculty_name:
      e.target.value,
  })
}
                    className="w-full bg-transparent outline-none"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                
                <label className="mb-3 block text-sm font-medium text-[#1F2937]">
                  Email
                </label>

                <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-[#F8FAF5] px-5 py-4">
                  
                  <Mail
                    className="text-[#355E3B]"
                    size={22}
                  />

                  <input
                    type="email"
                    value={faculty?.email || ""}
                    readOnly
                    className="w-full bg-transparent outline-none"
                  />
                </div>
              </div>

              {/* Department */}
              <div>
                
                <label className="mb-3 block text-sm font-medium text-[#1F2937]">
                  Department
                </label>

                <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-[#F8FAF5] px-5 py-4">
                  
                  <GraduationCap
                    className="text-[#355E3B]"
                    size={22}
                  />

                  <input
                    type="text"
                    value={
  faculty?.department || ""
}
onChange={(e) =>
  setFaculty({
    ...faculty,
    department:
      e.target.value,
  })
}
                    className="w-full bg-transparent outline-none"
                  />
                </div>
              </div>

              {/* College */}
              <div>
                
                <label className="mb-3 block text-sm font-medium text-[#1F2937]">
                  College
                </label>

                <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-[#F8FAF5] px-5 py-4">
                  
                  <Building2
                    className="text-[#355E3B]"
                    size={22}
                  />

                  <input
                    type="text"
                    value={
  faculty?.college_code || ""
}
onChange={(e) =>
  setFaculty({
    ...faculty,
    college_code:
      e.target.value,
  })
}
                    className="w-full bg-transparent outline-none"
                  />
                </div>
              </div>

              {/* Phone */}
<div>

  <label className="mb-3 block text-sm font-medium text-[#1F2937]">
    Phone Number
  </label>

  <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-[#F8FAF5] px-5 py-4">

    <input
      type="text"

      value={
        faculty?.phone || ""
      }

      onChange={(e) =>
        setFaculty({
          ...faculty,

          phone:
            e.target.value,
        })
      }

      className="w-full bg-transparent outline-none"

      placeholder="Enter phone number"
    />
  </div>
</div>

{/* Experience */}
<div>

  <label className="mb-3 block text-sm font-medium text-[#1F2937]">
    Experience
  </label>

  <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-[#F8FAF5] px-5 py-4">

    <input
      type="text"

      value={
        faculty?.experience || ""
      }

      onChange={(e) =>
        setFaculty({
          ...faculty,

          experience:
            e.target.value,
        })
      }

      className="w-full bg-transparent outline-none"

      placeholder="Example: 5 Years"
    />
  </div>
</div>

{/* Designation */}
<div>

  <label className="mb-3 block text-sm font-medium text-[#1F2937]">
    Designation
  </label>

  <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-[#F8FAF5] px-5 py-4">

    <input
      type="text"

      value={
        faculty?.designation || ""
      }

      onChange={(e) =>
        setFaculty({
          ...faculty,

          designation:
            e.target.value,
        })
      }

      className="w-full bg-transparent outline-none"

      placeholder="Example: Assistant Professor"
    />
  </div>
</div>

              {/* Bio */}
              <div>
                
                <label className="mb-3 block text-sm font-medium text-[#1F2937]">
                  Bio
                </label>

                <textarea
                  rows={5}
                  value={faculty?.bio || ""}
                  onChange={(e) =>
  setFaculty({
    ...faculty,
    bio:
      e.target.value,
  })
}
                  className="w-full rounded-2xl border border-gray-200 bg-[#F8FAF5] px-5 py-4 outline-none"
                />
              </div>

              {/* Save Button */}
              <button
                type="submit"
                className="w-full rounded-2xl bg-[#355E3B] py-5 text-lg font-semibold text-white transition hover:bg-[#2d4f32]"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      </section>
    </FacultyLayout>
  );
}