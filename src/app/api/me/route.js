import { NextResponse } from "next/server";

export const GET = async () => {
  return NextResponse.json({
    ok: true,
    fullName: "Nathapat Nerangsi",
    studentId: "650610758",
  });
};
