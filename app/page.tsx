import { prisma } from "@/src/db/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import Steps from "@/src/components/Main/Steps";
import SignIn from "@/src/components/Buttons/SignIn";
import { Service } from "@prisma/client";

async function Home() {

  const session = await getServerSession(authOptions);
  const userId = session?.user.id;

  if (userId === undefined) return (<><span>You need to be connected to access Booking app</span>
    <div><SignIn /></div></>)


  const getServicesList = async (userId: string) => {
    try {
      const res = await prisma.service.findMany({
        where: {
          createdById: userId,
        },
      })
      return res;

    } catch (error) {
      throw new Error("Data cannot be reach from the db");
    }
  }

  const services = await getServicesList(userId);

  return <Steps services={services} userId={userId} />

};

export default Home;


