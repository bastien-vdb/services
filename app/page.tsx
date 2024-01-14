import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/authOptions";
import Steps from "@/app/Components/Steps";
import SignIn from "@/src/components/Buttons/SignIn";
import useServerData from "@/src/hooks/useServerData";
import { Booking, Service } from "@prisma/client";
import moment from "moment";

async function Home() {

  const session = await getServerSession(authOptions);
  const userId = session?.user.id;
  console.log('ca fonctionne ! userId = ', userId)

  if (userId === undefined) return (<><span>You need to be connected to access Booking app</span>
    <div><SignIn /></div></>)

  const services: Service[] = await useServerData('service', { createdById: userId });
  const bookings: Booking[] = await useServerData('booking', {
    startTime: {
      gte: moment().startOf('day').toDate(),
      lt: moment().endOf('day').toDate(),
    },
    isAvailable: true,
    userId: userId ? userId : session?.user.id,
  });
  console.log('bookings from server comp:', bookings)

  return <Steps bookings={bookings} services={services} userId={userId} />

};

export default Home;


