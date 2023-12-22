import SelectService from "@/src/components/SelectService/SelectService";
import React, { useCallback, useEffect, useState } from "react";
import SelectBooking from "@/src/components/SelectBooking/SelectBooking";
import ServiceCalendar from "@/src/components/Calendar/ServiceCalendar";
import { useService } from '@/src/hooks/useService';
import { WithConnection } from "@/src/HOCs/WithConnection";
import { Button } from "@/src/components/ui/button";
import { useBooking } from "@/src/hooks/useBooking";
import { useSession, signIn, signOut } from "next-auth/react"
import { Session, getServerSession } from "next-auth";
import AuthLayout from "@/src/components/authLayout/AuthLayout";
import SignIn from "@/src/components/authLayout/SignIn";
import { authOptions } from "./api/auth/[...nextauth]/route";

async function Home() {
  console.log('server ? or client ?')
  // await signIn();
  const session = await getServerSession(authOptions);
  console.log('session from back',session)
  return (
      <SignIn/>
  )
}

export default Home;

// function Home() {

//   //@ts-ignore
//   const { bookingState, bookingDispatch } = useBooking();
//   const { serviceState, serviceDispatch } = useService();
//   const [session, setSession] = useState<Promise<Session|null>>();

//   const handleReset = useCallback(() => {
//     serviceDispatch({
//       type: 'RESET',
//     })
//   }, []);

//   const getUserSession = async ()=>{
//     // const { data: session } = useSession()
//     // console.log('s',session)
//   }
  

//   if (serviceState.serviceSelected) return (
//     <main className="flex flex-col">

//       <div className="flex">
//         <div className="m-auto flex gap-10 flex-wrap">
//           <AuthLayout/>
//           <ServiceCalendar />
//           {bookingState.daySelected && <SelectBooking />}
//           <Button variant="secondary" onClick={handleReset}>          
//             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
//               <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
//             </svg>
//           </Button>
//         </div>
//       </div>
//     </main >
//   );

//   return (
//     <main className="flex flex-col">
//       <>
//       Not signed in <br />
//           <button onClick={() => signIn()}>Sign in</button>
//           <button onClick={getUserSession}>get user session info</button>
//     </>
//       <div className="w-[800px] m-auto">
//         <SelectService />
//       </div>
//     </main >
//   )
// };

// export default WithConnection(Home);
