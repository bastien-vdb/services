import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface EmailRdvBookedProps {
  customerName?: string;
  customerFirstname?: string;
  bookingStartTime: string;
  businessPhysicalAddress: string;
  phone: string;
}

const baseUrl = process.env.NEXT_PUBLIC_HOST
  ? `${process.env.NEXT_PUBLIC_HOST}`
  : "";

export const EmailConfirmed = ({
  customerName,
  customerFirstname,
  bookingStartTime,
  businessPhysicalAddress,
  phone,
}: EmailRdvBookedProps) => {
  const bookingStartTimeFormatted = new Date(bookingStartTime);
  const optionsForDate: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
  };
  const optionsForTime: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
  };

  const dateString = bookingStartTimeFormatted.toLocaleDateString(
    "fr-FR",
    optionsForDate
  );
  const heureString = bookingStartTimeFormatted.toLocaleTimeString(
    "fr-FR",
    optionsForTime
  );

  return (
    <Html>
      <Head />
      <Preview>Confirmation de rendez-vous chez Finest Lash Studio</Preview>
      <Body style={main}>
        <Container style={container}>
          <Img
            src={`${baseUrl}/vendorImages/fineststudiologo.png`}
            width={48}
            height={48}
            alt="FinestLashStudio"
          />
          <Heading style={heading}>
            🪄 Bonjour {customerFirstname} {customerName} et merci pour votre
            réservation au sein du FinestLash Studio le{" "}
            {bookingStartTime && dateString} à {bookingStartTime && heureString}{" "}
          </Heading>
          <Section style={body}>
            <Text style={paragraph}>
              Merci pour votre réservation. Voici quelques instructions pour
              préparer au mieux votre rendez-vous :
            </Text>
            <Text style={paragraph}>
              <ul>
                <li>
                  <b style={{ textDecoration: "underline" }}>Cils propres : </b>{" "}
                  <p>
                    Bien qu’un nettoyage des cils soit inclus dans votre
                    prestation, la présence de maquillage ou de résidus (comme
                    des crèmes ou huiles appliquées autour des yeux) peut
                    prolonger cette étape, réduire le temps consacré à la pose
                    et potentiellement compromettre le résultat final. Si un
                    démaquillage est nécessaire, celui-ci sera facturé 10 €
                    supplémentaires, mais le temps de prestation sera tout de
                    même réduit.
                  </p>
                  <p>
                    Pour garantir une prestation complète et un résultat
                    optimal, nous vous recommandons vivement de venir avec des
                    cils parfaitement démaquillés et sans application de crème
                    ou d’huile sur le contour des yeux. Merci de votre
                    compréhension.
                  </p>
                </li>
                <li>
                  <b style={{ textDecoration: "underline" }}>Paiements : </b>
                  <p>
                    Si vous avez réglé un acompte en ligne, le solde devra
                    impérativement être réglé en espèces le jour J. Aucun autre
                    moyen de paiement n’est disponible pour le moment.
                  </p>
                </li>
                <li>
                  <p>
                    <b style={{ textDecoration: "underline" }}>Adresse : </b>
                    <p>
                      <Link href="https://maps.app.goo.gl/pxqxzXmFJNTvvuX16">
                        Le studio est situé au 43 rue Popincourt, 75011 Paris.
                      </Link>
                    </p>
                  </p>
                </li>
                <li>
                  <b style={{ textDecoration: "underline" }}>
                    Accompagnateurs :{" "}
                  </b>{" "}
                  <p>
                    Pour garantir une expérience calme et personnalisée, les
                    accompagnateurs ne sont pas acceptés.
                  </p>
                </li>
              </ul>

              <div style={{ marginTop: "60px" }}>
                <b>Politique d’annulation, modification et retard :</b>
              </div>

              <ul>
                <li>
                  <p>
                    Toute annulation ou modification de rendez-vous doit être
                    effectuée au moins 48 heures à l’avance. Passé ce délai,
                    l’acompte versé sera conservé en compensation.
                  </p>
                </li>
                <li>
                  <p>
                    En cas de retard supérieur à 15 minutes, votre rendez-vous
                    sera malheureusement annulé afin de ne pas perturber les
                    autres réservations. Nous vous remercions de votre
                    compréhension et de votre ponctualité.
                  </p>
                </li>
              </ul>

              <div style={{ marginTop: "60px" }}>
                <b style={{ textDecoration: "underline" }}>Contact : </b>
                <p>
                  Pour toute question, annulation ou modification de votre
                  rendez-vous, n’hésitez pas à nous contacter via SMS ou
                  WhatsApp au +33 7 83 63 97 38.
                </p>
              </div>
              <div style={{ marginTop: "60px" }}>
                Nous sommes impatients de sublimer votre regard et de vous
                offrir une expérience agréable.
              </div>
            </Text>
            <Text style={paragraph}>À bientôt !</Text>
          </Section>
          <Text style={paragraph}>
            Your Finest Lash Artist,
            {/* TODO: replace with company website */}
          </Text>
          <Hr style={hr} />
          <Img
            src={`${baseUrl}/vendorImages/fineststudiologo.png`}
            width={32}
            height={32}
            style={{
              WebkitFilter: "grayscale(100%)",
              filter: "grayscale(100%)",
              margin: "20px 0",
            }}
          />
          <Text style={footer}>{businessPhysicalAddress}</Text>
          <Text style={footer}>{phone}</Text>
          <Text style={footer}>http://www.finestlash.studio</Text>
        </Container>
      </Body>
    </Html>
  );
};

export default EmailConfirmed;

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 25px 48px",
  backgroundImage: 'url("/assets/raycast-bg.png")',
  backgroundPosition: "bottom",
  backgroundRepeat: "no-repeat, no-repeat",
};

const heading = {
  fontSize: "28px",
  fontWeight: "bold",
  marginTop: "48px",
};

const body = {
  margin: "24px 0",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "26px",
};

const link = {
  color: "#FF6363",
};

const hr = {
  borderColor: "#dddddd",
  marginTop: "48px",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  marginLeft: "4px",
};
