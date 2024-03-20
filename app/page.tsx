import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/authOptions";
import Steps from "@/app/Components/Steps";
import useServerData from "@/src/hooks/useServerData";
import { Booking, Service, User } from "@prisma/client";
import moment from "moment";
import { Hero } from "./Components/Hero/Hero";
import Subscribe from "./Components/Subscribe/Subscribe";
import useCheckStripe from "@/src/hooks/useCheckStripe";
import Header from "@/src/components/Header/Header";

async function Home() {
  const session = await getServerSession(authOptions);
  const userId = session?.user.id;

  //**** Si l'utilisateur n'est pas connecté à l'app (visiteur) ****
  if (userId === undefined)
    return (
      <div className="flex h-fit flex-col gap-2">
        <div className="mt-16"></div>
        <Hero />
      </div>
    );

  //**** Si l'utilisateur est connecté à l'app mais n'a pas commencé ou finalisé son inscription à Stripe ****
  const stripe = useCheckStripe();
  const user: User[] = await useServerData("user", { id: userId });
  const { stripeAccount } = user[0];
  let statusAccount: boolean = false;
  if (stripeAccount) {
    const account = await stripe.accounts.retrieve(stripeAccount);
    statusAccount = account.details_submitted;
  }
  if (!statusAccount || !stripeAccount)
    return <Subscribe userId={userId} stripeAccount={stripeAccount} />;

  //**** Si l'utilisateur est connecté et a finalisé son inscription à Stripe ****
  const services: Service[] = await useServerData("service", {
    createdById: userId,
  });
  const bookings: Booking[] = await useServerData("booking", {
    startTime: {
      gte: moment().startOf("day").toDate(),
      lt: moment().endOf("day").toDate(),
    },
    isAvailable: true,
    userId,
    payed: false,
  });
  return (
    <div>
      <Header />
      <Steps bookings={bookings} services={services} userId={userId} />
    </div>
  );
}

export default Home;
