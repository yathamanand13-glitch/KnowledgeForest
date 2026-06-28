import { NextResponse } from "next/server";
import { resend } from "@/lib/resend";

export async function POST(
  request: Request
) {
  try {

  console.log("API route called");

    const {
      email,
      facultyName,
    } = await request.json();

    console.log(email);
console.log(facultyName);
console.log(process.env.RESEND_API_KEY);

    const { data, error } =
  await resend.emails.send({

        from:
          "KnowledgeForest <onboarding@resend.dev>",

        to: email,

        subject:
          "🎉 Your KnowledgeForest Faculty Account Has Been Approved",

        html: `
          <div style="font-family:Arial;padding:30px">

            <h2>Congratulations ${facultyName}! 🎉</h2>

            <p>
              Your faculty account has been approved by the KnowledgeForest Admin.
            </p>

            <p>
              You can now:
            </p>

            <ul>
              <li>✅ Login</li>
              <li>✅ Upload Resources</li>
              <li>✅ Manage Uploads</li>
              <li>✅ Access Faculty Dashboard</li>
            </ul>

            <br/>

            <a
              href="http://localhost:3000/login"
              style="
                background:#355E3B;
                color:white;
                padding:12px 20px;
                text-decoration:none;
                border-radius:8px;
              "
            >
              Login Now
            </a>

            <br/><br/>

            <p>
              Thank you for contributing to KnowledgeForest.
            </p>

          </div>
        `,

      });

      console.log("Data:", data);
console.log("Error:", error);

    if (error) {
      return NextResponse.json(
        error,
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
    });

  } catch {

    return NextResponse.json(
      {
        error:
          "Failed to send email.",
      },
      {
        status: 500,
      }
    );

  }
}