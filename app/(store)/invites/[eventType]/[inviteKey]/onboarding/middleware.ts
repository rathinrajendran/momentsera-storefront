// // middleware.ts (in your root directory)
// import { NextResponse } from 'next/server'
// import type { NextRequest } from 'next/server'

// export function middleware(request: NextRequest) {
//   const { pathname } = request.nextUrl;

//   // Only run this logic for the resolver route
//   if (pathname.startsWith('/onboarding-resolver')) {
//     const pendingCookie = request.cookies.get('pending_event')?.value;

//     if (!pendingCookie) {
//       return NextResponse.redirect(new URL('/', request.url));
//     }

//     try {
//       const pending = JSON.parse(pendingCookie);
//       const inviteKey = pathname.split('/')[2]; // Extracting from URL if needed

//       if (pending.invite_key === inviteKey) {
//         return NextResponse.redirect(
//           new URL(`/invites/${inviteKey}/onboarding/forms/${pending.event_type}`, request.url)
//         );
//       }
//     } catch (e) {
//       return NextResponse.redirect(new URL('/', request.url));
//     }
//   }
// }
