"use client";

import { useState } from "react";

import AppLayout from "@/components/AppLayout";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useEffect } from "react";
import Image from "next/image";

import {
  GraduationCap,
  Lock,
  User,
  Building2,
  Mail,
  Phone,
  Camera,
} from "lucide-react";

export default function AuthPage() {
  const [isLogin, setIsLogin] =
    useState(true);

  const [profileImage, setProfileImage] =
    useState<string | null>(null);

 useEffect(() => {

  return () => {

    if (profileImage) {

      URL.revokeObjectURL(
        profileImage
      );
    }
  };

}, [profileImage]);

const [
  resendCooldown,
  setResendCooldown
] = useState(0);

const [
  verificationMessage,
  setVerificationMessage
] = useState("");

const [loading, setLoading] =
  useState(false);

useEffect(() => {

  if (resendCooldown <= 0)
    return;

  const timer =
    setInterval(() => {

      setResendCooldown(
        (prev) => prev - 1
      );
    }, 1000);

  return () =>
    clearInterval(timer);

}, [resendCooldown]);

useEffect(() => {

  const checkVerification =
    async () => {

      const {
        data: { user }
      } =
        await supabase.auth.getUser();

      if (
        user?.email_confirmed_at
      ) {

        await supabase
          .from("faculties")
          .update({
            is_verified: true
          })
          .eq(
            "email",
            user.email
          );
      }
    };

  checkVerification();

}, []);

  const [showPassword, setShowPassword] =
  useState(false);

const [
  showConfirmPassword,
  setShowConfirmPassword
] = useState(false);

    const router = useRouter();

    useEffect(() => {

  const savedLogin =
    localStorage.getItem(
      "rememberedLogin"
    );

  if (savedLogin) {

    setLoginInput(savedLogin);

    setRememberMe(true);

  }

}, []);

    const [name, setName] =
  useState("");

const [loginInput, setLoginInput] =
  useState("");

  const [email, setEmail] =
  useState("");

  const [phone, setPhone] =
  useState("");

const [password, setPassword] =
  useState("");

  const [rememberMe, setRememberMe] =
  useState(false);

  const [
  confirmPassword,
  setConfirmPassword
] = useState("");

const [facultyId, setFacultyId] =
  useState("");

const [collegeCode, setCollegeCode] =
  useState("");

const [department, setDepartment] =
  useState("");

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (file) {
      

        if (
  file.size >
  5 * 1024 * 1024
) {

  alert(
    "Image must be below 5MB"
  );

  return;
}

const allowed =
  [
    "image/jpeg",
    "image/png",
    "image/webp"
  ];

if (
  !allowed.includes(file.type)
) {

  alert(
    "Only JPG, PNG, WEBP allowed"
  );

  return;
}

 if (profileImage) {
  URL.revokeObjectURL(profileImage);
}

const imageUrl =
  URL.createObjectURL(file);

      setProfileImage(imageUrl);

    }
  };

  const resendVerificationEmail =
  async () => {

    if (!email) {

      alert(
        "Enter email first"
      );

      return;
    }

    try {

      const {
        error
      } =
        await supabase.auth.resend({

          type: "signup",

          email:
            email.toLowerCase(),
        });

      if (error) {

        alert(error.message);

        return;
      }

      setVerificationMessage(
        "Verification email resent successfully."
      );

      setResendCooldown(60);

    } catch (err: unknown) {

      alert(
  err instanceof Error
    ? err.message
    : "Something went wrong"
);
    }
  };

  const handleForgotPassword =
  async () => {

    const emailInput =
      prompt(
        "Enter your registered email"
      );

    if (!emailInput) return;

    const { error } =
      await supabase.auth.resetPasswordForEmail(
        emailInput.trim(),
        {
          redirectTo:
            `${window.location.origin}/reset-password`,
        }
      );

    if (error) {

      alert(error.message);

      return;
    }

    alert(
      "Password reset email sent."
    );
  };

  const handleAuth =
  async () => {

    if (loading) return;

    try {

      if (
  !(
  isLogin
    ? loginInput
    : email
) || !password
) {

  alert(
    "Email and password required"
  );

  return;
}

const emailRegex =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (
  !isLogin &&
  !emailRegex.test(
    email.trim()
  )
) {

  alert(
    "Enter valid email address"
  );

  return;
}

if (
  password.length < 6
) {

  alert(
    "Password must be at least 6 characters"
  );

  return;
}


if (
  !isLogin &&
  (
    !name ||
    !facultyId ||
    !collegeCode ||
    !department
  )
) {

  alert(
    "Please fill all fields"
  );

  return;
}

if (
  !isLogin &&
  !/^\d{10}$/.test(phone)
) {

  alert(
    "Enter valid 10 digit phone number"
  );

  return;
}

if (
  !isLogin &&
  facultyId.length < 4
) {

  alert(
    "Invalid faculty ID"
  );

  return;
}

      if (
  !isLogin &&
  password !== confirmPassword
) {

  alert(
    "Passwords do not match"
  );

  return;
}

setLoading(true);

      if (isLogin) {

       let loginEmail =
  loginInput.trim();

if (!loginInput.includes("@")) {

  const isPhone =
  /^\d+$/.test(loginInput);

const column =
  isPhone
    ? "phone"
    : "faculty_id";

  const {
    data: facultyData,
    error: facultyLookupError
  } = await supabase

    .from("faculties")

    .select(`
  email,
  is_verified
`)

    .eq(
  column,
  isPhone
    ? loginInput
    : loginInput.toUpperCase()
)

    .single();

  if (
    facultyLookupError ||
    !facultyData
  ) {

    alert(
      "Faculty not found"
    );

    setLoading(false);

    return;
  }

   if (
  !facultyData.email
) {

  alert(
    "Faculty email missing"
  );

  setLoading(false);

  return;
}

  loginEmail =
    facultyData.email;

    if (
  !facultyData.is_verified
) {

  alert(
    "Please verify your account first"
  );

  setLoading(false);

  return;
}
}

const {
  error
} =
  await supabase.auth.signInWithPassword({

    email:
  loginEmail.toLowerCase(),

    password,
});

if (error) {

  alert(error.message);

  setLoading(false);

  return;
}

const {
  data: { user }
} = await supabase.auth.getUser();

if (
  !user?.email_confirmed_at
) {

  alert(
    "Please verify your email first"
  );

  await supabase.auth.signOut();

  setLoading(false);

  return;
}

        if (rememberMe) {

  localStorage.setItem(
    "rememberedLogin",
    loginInput
  );

} else {

  localStorage.removeItem(
    "rememberedLogin"
  );

}

alert("Login successful");

router.replace("/upload");

      } else {

        const {
  data: existingFaculty
} = await supabase
  .from("faculties")
  .select("id")
  .or(`
email.eq.${email.toLowerCase()},
faculty_id.eq.${facultyId.toUpperCase()},
phone.eq.${phone}
`)
  .maybeSingle();

if (existingFaculty) {

  alert(
    "Faculty already exists"
  );

  setLoading(false);

  return;
}

       const {
  data,
  error
} =
  await supabase.auth.signUp({

    email:
      email.toLowerCase(),

    password,

    options: {

      data: {

        faculty_name: name,

        faculty_id:
          facultyId.toUpperCase(),

      },
    },
  });

if (error) {

  alert(error.message);

  setLoading(false);

  return;
}

const userId =
  data.user?.id;

if (!userId) {

  alert(
    "Verification email sent. Please verify your email."
  );

  setLoading(false);

  return;
}

        const {
  data: collegeData,
  error: collegeError
} = await supabase

  .from("colleges")

  .select("id")

  .eq(
  "code",
  collegeCode.toUpperCase()
)

  .maybeSingle();

  console.log(
  "COLLEGE DATA:",
  collegeData
);

console.log(
  "COLLEGE ERROR:",
  collegeError
);


  if (
  collegeError ||
  !collegeData
) {

  alert(
    "Invalid college code"
  );

  setLoading(false);

  return;
}

        const {
  error: facultyError
} =
  await supabase
    .from("faculties")
    .insert({

  id: userId,

  faculty_name: name.trim(),

  faculty_id:
    facultyId.toUpperCase(),

  email:
    email.toLowerCase(),

  phone,

  password_hash: "supabase-auth",

  profile_photo_url:
  profileImage || "",

  is_verified: false,

  role: "faculty",

  department:
    department.trim(),

  college_code:
    collegeCode.toUpperCase(),

  college_id:
    collegeData.id,

    approval_status:
        "pending",

      can_upload:
        false,

      status:
        "active",

  created_at:
    new Date().toISOString(),

});

       if (facultyError) {

  console.error(
    "FACULTY INSERT ERROR:",
    facultyError
  );

  alert(
    facultyError.message
  );

  setLoading(false);

  return;
}

       alert(
  "Verification email sent. Please verify your email before login."
);

        setIsLogin(true);
      }

    } catch (err: unknown) {

  console.error(
    "AUTH ERROR:",
    err
  );

  alert(
  err instanceof Error
    ? err.message
    : "Something went wrong"
);

    } finally {

      setLoading(false);

    }
  };

  return (
    <AppLayout>
      <section className="flex min-h-[85vh] items-center justify-center px-6 py-16">
        
        <div className="w-full max-w-xl rounded-[32px] bg-white p-8 shadow-2xl sm:p-10">
          
          {/* Logo */}
          <div className="flex justify-center">
            
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#355E3B] text-white shadow-lg">
              
              <GraduationCap size={46} />
            </div>
          </div>

          {/* Heading */}
          <div className="mt-8 text-center">
            
            <h1 className="text-4xl font-bold text-[#1F2937]">
              {isLogin
                ? "Faculty Login"
                : "Create Faculty Account"}
            </h1>

            <p className="mt-4 text-gray-500">
              {isLogin
                ? "Access your dashboard and manage academic resources."
                : "Register as a verified faculty contributor."}
            </p>
            {!isLogin && (
  <div className="
    mt-4
    rounded-xl
    bg-blue-100
    px-4
    py-3
    text-sm
    font-medium
    text-blue-700
  ">
    📩 Verify your email after registration to activate your account.
  </div>
)}
          </div>

          {/* Form */}
          <form
  className="mt-10 space-y-6"
  autoComplete="off"
  onSubmit={(e) => {
    e.preventDefault();

     handleAuth();
  }}
>
            
            {/* Register Fields */}
            {!isLogin && (
              <>
                {/* Profile Upload */}
                <div className="flex flex-col items-center">
                  
                  <label className="relative cursor-pointer">
                    
                    <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-[#355E3B] bg-[#EEF2E6]">
                      
                      {profileImage ? (
                        <Image
  src={profileImage}
  alt="Profile"
  fill
  className="object-cover"
/>
                      ) : (
                        <Camera
                          className="text-[#355E3B]"
                          size={36}
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

                  <p className="mt-3 text-sm text-gray-500">
                    Upload Profile Photo
                  </p>
                </div>

                {/* Faculty Name */}
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
                      placeholder="Enter Full Name"
                      value={name}
onChange={(e) =>
  setName(
  e.target.value.replace(
    /[^a-zA-Z.\s]/g,
    ""
  )
)
}
                      className="w-full bg-transparent outline-none placeholder:text-gray-400"
                    />
                  </div>
                </div>

                {/* Email */}
                {!isLogin && (
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
                      placeholder="Enter Email"
                      autoCapitalize="none"
                      value={email}
onChange={(e) =>
  setEmail(
  e.target.value.trim()
)
}
                      className="w-full bg-transparent outline-none placeholder:text-gray-400"
                    />
                  </div>
                </div>
)}


                {/* Phone */}
{!isLogin && (
  <div>

  <label className="mb-3 block text-sm font-medium text-[#1F2937]">
    Phone Number
  </label>

  <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-[#F8FAF5] px-5 py-4">

    <Phone
      className="text-[#355E3B]"
      size={22}
    />

    <input
      type="tel"
      placeholder="Enter Phone Number"
      value={phone}
      maxLength={10}
      onChange={(e) =>
  setPhone(
  e.target.value
    .replace(/\D/g, "")
    .trim()
)
}
      className="w-full bg-transparent outline-none placeholder:text-gray-400"
    />
  </div>
</div>
)}

                {/* Department */}
                {!isLogin && (
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
                      placeholder="Enter Department"
                      value={department}
onChange={(e) =>
  setDepartment(
  e.target.value.replace(
    /[^a-zA-Z\s-]/g,
    ""
  )
)
}
                      className="w-full bg-transparent outline-none placeholder:text-gray-400"
                    />
                  </div>
                </div>
                )}
              </>
            )}

            {/* Faculty ID */}
            {!isLogin && (
  <div>
              
              <label className="mb-3 block text-sm font-medium text-[#1F2937]">
                Faculty ID
              </label>

              <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-[#F8FAF5] px-5 py-4">
                
                <User
                  className="text-[#355E3B]"
                  size={22}
                />

                <input
                  type="text"
                  placeholder="Enter Faculty ID"
                  maxLength={20}
                  value={facultyId}
onChange={(e) =>
  setFacultyId(
    e.target.value
      .replace(
        /[^a-zA-Z0-9]/g,
        ""
      )
      .toUpperCase()
  )
}
                  className="w-full bg-transparent outline-none placeholder:text-gray-400"
                />
              </div>
            </div>
)}

            {/* College Code */}
           {!isLogin && (
  <div>
              
              <label className="mb-3 block text-sm font-medium text-[#1F2937]">
                College Code
              </label>

              <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-[#F8FAF5] px-5 py-4">
                
                <Building2
                  className="text-[#355E3B]"
                  size={22}
                />

                <input
                  type="text"
                  placeholder="Enter College Code"
                  value={collegeCode}
                  maxLength={15}
onChange={(e) =>
  setCollegeCode(
    e.target.value
      .replace(
        /[^a-zA-Z0-9]/g,
        ""
      )
      .toUpperCase()
  )
}
                  className="w-full bg-transparent outline-none placeholder:text-gray-400"
                />
              </div>
            </div>
)}

{isLogin && (
  <div>

    <label className="mb-3 block text-sm font-medium text-[#1F2937]">
      Faculty ID / Email / Phone
    </label>

    <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-[#F8FAF5] px-5 py-4">

      <User
        className="text-[#355E3B]"
        size={22}
      />

      <input
        type="text"
        placeholder="Enter Faculty ID, Email or Phone"
        autoCapitalize="none"
        value={loginInput}
        onChange={(e) =>
  setLoginInput(
  e.target.value.trim()
)
}
        className="w-full bg-transparent outline-none placeholder:text-gray-400"
      />
    </div>
  </div>
)}

            {/* Password */}
            <div>
              
              <label className="mb-3 block text-sm font-medium text-[#1F2937]">
                Password
              </label>

              <div className="relative flex items-center gap-3 rounded-2xl border border-gray-200 bg-[#F8FAF5] px-5 py-4">
                
                <Lock
                  className="text-[#355E3B]"
                  size={22}
                />

                <input
                  type={
  showPassword
    ? "text"
    : "password"
}
                  placeholder="Enter Password"
                  value={password}
                  minLength={6}
onChange={(e) =>
  setPassword(
  e.target.value
)
}


                  className="w-full bg-transparent pr-10 outline-none placeholder:text-gray-400"
                />
                <button
  type="button"
  onClick={() =>
    setShowPassword(
      !showPassword
    )
  }
  className="
    absolute
    right-4
    top-1/2
    -translate-y-1/2
    text-gray-500
  "
>
  {showPassword
    ? "🙈"
    : "👁️"}
</button>
              </div>
            </div>

            {/* Confirm Password */}
            {!isLogin && (
              <div>
                
                <label className="mb-3 block text-sm font-medium text-[#1F2937]">
                  Confirm Password
                </label>

               <div className="relative flex items-center gap-3 rounded-2xl border border-gray-200 bg-[#F8FAF5] px-5 py-4">
                  
                  <Lock
                    className="text-[#355E3B]"
                    size={22}
                  />

                  <input
                    type={
  showConfirmPassword
    ? "text"
    : "password"
}
                    placeholder="Confirm Password"
                    value={confirmPassword}
onChange={(e) =>
  setConfirmPassword(
     e.target.value
  )
}
                    className="w-full bg-transparent pr-10 outline-none placeholder:text-gray-400"
                  />
                  <button
  type="button"
  onClick={() =>
    setShowConfirmPassword(
      !showConfirmPassword
    )
  }
  className="
    absolute
    right-4
    top-1/2
    -translate-y-1/2
    text-gray-500
  "
>
  {showConfirmPassword
    ? "🙈"
    : "👁️"}
</button>
                </div>
              </div>
            )}

            {/* Remember */}
            {isLogin && (
              <div className="flex items-center justify-between">
                
                <label className="flex items-center gap-3 text-sm text-gray-600">
                  
                  <input
  type="checkbox"
  checked={rememberMe}
  onChange={(e) =>
    setRememberMe(
      e.target.checked
    )
  }
  className="h-4 w-4 rounded border-gray-300"
/>

                  Remember Me
                </label>

                <button
  type="button"
  onClick={
    handleForgotPassword
  }
  className="text-sm font-medium text-[#355E3B] hover:underline"
>
  Forgot Password?
</button>
              </div>
            )}

{!isLogin && (
  <div className="space-y-3">

    {verificationMessage && (
      <div className="
        rounded-xl
        bg-green-100
        px-4
        py-3
        text-sm
        text-green-700
      ">
        {verificationMessage}
      </div>
    )}

    <button
      type="button"
      disabled={
        resendCooldown > 0
      }
      onClick={
        resendVerificationEmail
      }
      className="
        w-full
        rounded-xl
        border
        border-[#355E3B]
        py-3
        text-sm
        font-medium
        text-[#355E3B]
        transition
        hover:bg-[#355E3B]
        hover:text-white
        disabled:cursor-not-allowed
        disabled:opacity-60
      "
    >
      {resendCooldown > 0
        ? `Resend in ${resendCooldown}s`
        : "Resend Verification Email"}
    </button>
  </div>
)}

            {/* Button */}
            <button
  type="submit"
  disabled={loading}
              className="w-full rounded-2xl bg-[#355E3B] py-4 text-lg font-semibold text-white transition hover:bg-[#2d4f32]
disabled:cursor-not-allowed
disabled:opacity-70"
            >
              {loading
  ? "Please wait..."
  : isLogin
  ? "Login"
  : "Create Account"}
            </button>
          </form>

          {/* Toggle */}
          <div className="mt-8 text-center text-sm text-gray-500">
            
            {isLogin
              ? "Don't have an account?"
              : "Already have an account?"}

            <button
  disabled={loading}
  onClick={() =>
    setIsLogin(!isLogin)
  }
              className="ml-2 font-medium text-[#355E3B] hover:underline"
            >
              {isLogin ? "Register" : "Login"}
            </button>
          </div>
        </div>
      </section>
    </AppLayout>
  );
}