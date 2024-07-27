import Steps from "@/app/Components/Steps";
import Header from "@/src/components/Header/Header";
import useCheckStripe from "@/src/hooks/useCheckStripe";
import useServerData from "@/src/hooks/useServerData";
import { Service, User } from "@prisma/client";
import { getServerSession } from "next-auth";
import { Hero } from "./Components/Hero/Hero";
import Subscribe from "./Components/Subscribe/Subscribe";
import { authOptions } from "./api/auth/[...nextauth]/authOptions";

async function Home({ params }: { params: { userId: string } }) {
  const { userId: userIdInParams } = params;

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
  const [user] = (await useServerData("user", { id: userId })) as User[];

  const { stripeAccount } = user;

  const statusAccount = stripeAccount
    ? (await stripe.accounts.retrieve(stripeAccount)).details_submitted
    : null;

  if (!statusAccount && user.role === "OWNER")
    return <Subscribe userId={userId} stripeAccount={stripeAccount} />;

  //**** Si l'utilisateur est connecté et a finalisé son inscription à Stripe ou qu'il n'est pas Owner mais employé -->****

  //Pour empêcher d'accéder à l'app sans id en paramètre car cela n'a pas de sens fonctionnelement et provoque des erreurs
  if (!userIdInParams)
    return (
      <div className="mt-40">
        <h3 className="text-center sm:text-xl">
          Veuillez vous connecter à une URL d'un utilisateur existant
        </h3>
      </div>
    );

  return (
    <>
      <Header />
      <Steps userId={userId} />
    </>
  );
}

export default Home;
