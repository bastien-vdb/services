import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/authOptions";
import Steps from "@/app/Components/Steps";
import useServerData from "@/src/hooks/useServerData";
import { Booking, Service } from "@prisma/client";
import moment from "moment";
import Login from "@/app/Components/Login/Login";

async function Home() {

  const session = await getServerSession(authOptions);
  const userId = session?.user.id;

  if (userId === undefined) return <Login/>;

  const services: Service[] = await useServerData('service', { createdById: userId });
  const bookings: Booking[] = await useServerData('booking', {
    startTime: {
      gte: moment().startOf('day').toDate(),
      lt: moment().endOf('day').toDate(),
    },
    isAvailable: true,
    userId,
    payed:false,
  });

  return <Steps bookings={bookings} services={services} userId={userId} />

};

export default Home;


