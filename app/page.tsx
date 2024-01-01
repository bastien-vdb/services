import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import Steps from "@/src/components/Main/Steps";
import SignIn from "@/src/components/Buttons/SignIn";
import useServerData from "@/src/hooks/useServerData";
import { Service } from "@prisma/client";

async function Home() {

  const session = await getServerSession(authOptions);
  const userId = session?.user.id;

  if (userId === undefined) return (<><span>You need to be connected to access Booking app</span>
    <div><SignIn /></div></>)

  const services: Service[] = await useServerData('service', { createdById: userId })

  return <Steps services={services} userId={userId} />

};

export default Home;


