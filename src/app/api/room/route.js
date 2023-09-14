import { DB, readDB, writeDB } from "@/app/libs/DB";
import { checkToken } from "@/app/libs/checkToken";
import { nanoid } from "nanoid";
import { NextResponse } from "next/server";

export const GET = async () => {
  readDB();
  // const findTotalRooms = DB.rooms.map(
  //   (x) =>
  // )
  return NextResponse.json({
    ok: true,
    rooms: DB.rooms,
    totalRooms: DB.rooms
  });
};

export const POST = async (request) => {
  let role = null;
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
  role = payload.role;
  roomId = payload.roomId;

  const body = await request.json();
  const { roomName } = body;

  if(role === "ADMIN" || role === "SUPER_ADMIN"){
    readDB();
    

    const foundEnroll = DB.rooms.find(
      (x) => x.roomId === roomId && x.roomName === roomName
    );
    if (foundEnroll) {
      return NextResponse.json(
        {
          ok: false,
          message: `Room ${payload.roomName} already exists`,
        },
        { status: 400 }
      );
    }

    readDB();
    const roomId = nanoid();
    DB.rooms.push({
      roomId,
      roomName
    });
    //call writeDB after modifying Database
    writeDB();
  }
  return NextResponse.json({
    ok: true,
    roomId,
    message: `Room ${roomName} has been created`,
  });
};
