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
  bookingStartTime?: Date;
}

const baseUrl = process.env.NEXT_PUBLIC_HOST
  ? `https://${process.env.NEXT_PUBLIC_HOST}`
  : "";

export const EmailRdvBooked = ({
  customerName,
  bookingStartTime,
}: EmailRdvBookedProps) => (
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
        <Heading style={heading}>🪄 Bonjour {customerName} et merci pour votre réservation au sein du FinestLash Studio le {bookingStartTime?.getDate.toString().toString()} à {bookingStartTime?.getTime()}

        </Heading>
        <Section style={body}>
          <Text style={paragraph}>
            Quelques petites instructions pour préparer au mieux votre rendez-vous :
          </Text>
          <Text style={paragraph}>
            Il faudra venir avec les cils bien propres, sans avoir mis de crème ou d’huile au niveau des yeux. Tout démaquillage sera facturé 5€ de plus.
          </Text>
          <Text style={paragraph}>
            Si vous avez choisi le paiement de l'acompte sur le site, il faudra impérativement régler le solde en ESPÈCES le jour J.
          </Text>
          <Text style={paragraph}>
            Le studio se trouve au 36 chemin des Huats, 93000 Bobigny.
          </Text>
          <Text style={paragraph}>
            Une fois arrivé(e), vous pourrez m'envoyer un message ou m'appeler au 0783639738 pour m'informer de votre arrivée. (attention, il ne faut pas sonner !)
          </Text>
          <Text style={paragraph}>
            Les accompagnateurs ne sont pas acceptés.
          </Text>
          <Text style={paragraph}>
            À bientôt !
          </Text>
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
        <Text style={footer}>36 chemin des Huats</Text>
        <Text style={footer}>93000 Bobigny</Text>
        <Text style={footer}>+33783639738</Text>
        <Text style={footer}>
          http://www.finestlash.studio
        </Text>
      </Container>
    </Body>
  </Html>
);

export default EmailRdvBooked;

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
