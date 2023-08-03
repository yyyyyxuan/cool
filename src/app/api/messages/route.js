import { NextResponse } from 'next/server'
import Pusher from 'pusher';

const pusher = new Pusher({
  appId: process.env.APP_ID,
  key: process.env.KEY,
  secret: process.env.SECRET,
  cluster: process.env.CLUSTER,
  useTLS: true
});


export async function POST(request) {
  const res = await request.json()
  console.log(res)
  pusher.trigger("my-channel", "my-event", {
    message: res.message,
    
  });
  return NextResponse.json({ res })
}