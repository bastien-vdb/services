import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
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
      <Preview>Confirmation de rendez-vous</Preview>
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
            !
          </Heading>
          <Section style={body}>
            <Text style={paragraph}>
              Quelques petites instructions pour préparer au mieux votre
              rendez-vous :
            </Text>
            <Text style={paragraph}>
              Il faudra venir avec les cils bien propres, sans avoir mis de
              crème ou d’huile au niveau des yeux. Tout démaquillage sera
              facturé 5€ de plus.
            </Text>
            <Text style={paragraph}>
              Si vous avez choisi le paiement de l&apos;acompte sur le site, il
              faudra impérativement régler le solde en ESPÈCES le jour J.
            </Text>
            <Text style={paragraph}>
              Le studio se trouve au {businessPhysicalAddress}.
            </Text>
            <Text style={paragraph}>
              Une fois arrivé(e), vous pourrez m&apos;envoyer un message ou
              m&apos;appeler au {phone} pour m&apos;informer de votre arrivée.
              (attention, il ne faut pas sonner !)
            </Text>
            <Text style={paragraph}>
              Les accompagnateurs ne sont pas acceptés.
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
