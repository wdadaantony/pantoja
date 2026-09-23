import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request:NextRequest){
  let response=NextResponse.next({request});
  const url=process.env.NEXT_PUBLIC_SUPABASE_URL;const key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const isLogin=request.nextUrl.pathname==='/admin/login';
  if(!url||!key){if(!isLogin)return NextResponse.redirect(new URL('/admin/login',request.url));return response}
  const supabase=createServerClient(url,key,{cookies:{getAll:()=>request.cookies.getAll(),setAll(cookies){cookies.forEach(({name,value})=>request.cookies.set(name,value));response=NextResponse.next({request});cookies.forEach(({name,value,options})=>response.cookies.set(name,value,options))}}});
  const {data:{user}}=await supabase.auth.getUser();
  if(!user&&!isLogin)return NextResponse.redirect(new URL('/admin/login',request.url));
  if(user&&isLogin)return NextResponse.redirect(new URL('/admin',request.url));
  return response;
}
export const config={matcher:['/admin/:path*']};
