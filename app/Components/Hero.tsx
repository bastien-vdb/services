import { Typography } from "@/src/components/ui/typography";
import { ReviewSmall } from "./ReviewSmall";
import { CircleSvg } from "./CircleSvg";

export const Hero = () => {
  return (
    <main className="m-auto mx-4 my-20 flex flex-col items-center justify-center gap-4">
      <div className="relative flex flex-1 flex-col items-start gap-4 lg:gap-6 xl:gap-8">
        <Typography variant="h1" className="!leading-tight">
          <p>Réservation Instantanée pour{" "}</p>
          <p className="inline-block -rotate-2 bg-foreground text-background">
            Freelances {" "}
            <span className="relative inline-block">
              <span>Et Entrepreneurs</span>
              <CircleSvg className="fill-primary" />
            </span>
          </p>
        </Typography>
        <Typography variant="large">
          <p>Révolutionnez Votre Business en Quelques Clics !</p>

          <p><b>QuickReserve.app</b> est l'outil ultime pour les freelances </p>
          <p>et les entrepreneurs désireux de simplifier leur processus de vente </p>
          <p>et de réservation.</p>
          <p> Avec QuickReserve, créez et proposez vos services en un clin d'œil, </p>
          <p>et laissez vos clients réserver en toute simplicité.</p>
        </Typography>

        {/* <Link
          href="#pricing"
          className={cn(buttonVariants({ size: "lg", variant: "default" }))}
        >
          <Rocket size={20} className="mr-2" /> Rejoins maintenant
        </Link> */}

        <ReviewSmall
          stars={5}
          avatars={[
            "https://i.pravatar.cc/300?u=1",
            "https://i.pravatar.cc/300?u=2",
            "https://i.pravatar.cc/300?u=3",
          ]}
        >
          122+ utilisateurs l'utilisent
        </ReviewSmall>
      </div>
      <div className="flex flex-1 justify-center sm:justify-end">
        <img
          src="/images/hero.png"
          className="w-96 max-w-lg object-contain max-md:max-w-md"
          alt="Hero images"
        />
      </div>
    </main>
  );
};
