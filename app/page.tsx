import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/authOptions";
import Steps from "@/app/Components/Steps";
import useServerData from "@/src/hooks/useServerData";
import { Booking, Service, User } from "@prisma/client";
import moment from "moment";
import Login from "@/app/Components/Login/Login";
import { Hero } from "./Components/Hero";
import Stripe from "stripe";
import Subscribe from "./Components/Subscribe/Subscribe";

async function Home() {

  const session = await getServerSession(authOptions);
  const userId = session?.user.id;


  if (userId === undefined) return (
    <div className="flex h-fit flex-col gap-2">
      <div className="mt-16"></div>

      <Hero />
      <Login />
    </div>
  )

  if (!process.env.STRIPE_SECRET_KEY) return new Response("Stripe secret key is not defined", { status: 400 });
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2023-10-16" });

  const user: User[] = await useServerData('user', { id: userId });
  const { stripeAccount } = user[0];
  let statusAccount: boolean = false;

  if (stripeAccount) {
    const account = await stripe.accounts.retrieve(stripeAccount);
    statusAccount = account.details_submitted;
  }



  const services: Service[] = await useServerData('service', { createdById: userId });
  const bookings: Booking[] = await useServerData('booking', {
    startTime: {
      gte: moment().startOf('day').toDate(),
      lt: moment().endOf('day').toDate(),
    },
    isAvailable: true,
    userId,
    payed: false,
  });



  if (!statusAccount || !stripeAccount) return <Subscribe userId={userId} stripeAccount={stripeAccount} />

  return <Steps bookings={bookings} services={services} userId={userId} />

};

export default Home;


