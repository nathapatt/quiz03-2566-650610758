import { DB, readDB, writeDB } from "@/app/libs/DB";
import { checkToken } from "@/app/libs/checkToken";
import { nanoid } from "nanoid";
import { NextResponse } from "next/server";

export const GET = async (request) => {
  readDB();
  const roomId = request.nextUrl.searchParams.get("roomId");

  

  const courseNoList = [];
  for (const enroll of DB.messages) {
    if (enroll.roomId === roomId) {
      courseNoList.push(enroll.roomId);
    }else{
    //   return NextResponse.json(
    // {
    //   ok: false,
    //   message: `Room is not found`,
    // },
    // { status: 404 }
    //   );
    }
  }

  return NextResponse.json({
    ok: true,
    courseNoList,
  });
};

export const POST = async (request) => {
  readDB();

  // return NextResponse.json(
  //   {
  //     ok: false,
  //     message: `Room is not found`,
  //   },
  //   { status: 404 }
  // );

  const messageId = nanoid();

  writeDB();

  return NextResponse.json({
    ok: true,
    // messageId,
    message: "Message has been sent",
  });
};

export const DELETE = async (request) => {
  let role = null;
  let messageId = null;
  const payload = checkToken();
  if(!payload){
  return NextResponse.json(
    {
      ok: false,
      message: "Invalid token",
    },
    { status: 401 }
  );
    }
  readDB();

  role = payload.role;
  messageId = payload.messageId;

  if(role === "SUPER_ADMIN"){
    const body = await request.json();
    const { messageId } = body;


  const foundIndex = DB.messages.findIndex(
    (x) => x.messageId === messageId
  );
  if (foundIndex === -1) {
      return NextResponse.json(
    {
      ok: false,
      message: "Message is not found",
    },
    { status: 404 }
  );

  }

  DB.messages.splice(foundIndex, 1);

  writeDB();

  return NextResponse.json({
    ok: true,
    message: "Message has been deleted",
  });
  }
};
