import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Text,
} from "@react-email/components";
import * as React from "react";

interface EmailConfirmedCollaboratorProps {
  customerName?: string;
  bookingStartTime: string;
}

const baseUrl = process.env.NEXT_PUBLIC_HOST
  ? `${process.env.NEXT_PUBLIC_HOST}`
  : "";

export const EmailConfirmedCollaborator = ({
  customerName,
  bookingStartTime,
}: EmailConfirmedCollaboratorProps) => {
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
            🪄 Votre rendez-vous avec {customerName}, le{" "}
            {bookingStartTime && dateString} à {bookingStartTime && heureString}{" "}
            a bien été confirmé.
          </Heading>
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
          <Text style={footer}>http://www.finestlash.studio</Text>
        </Container>
      </Body>
    </Html>
  );
};

export default EmailConfirmedCollaborator;

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

const hr = {
  borderColor: "#dddddd",
  marginTop: "48px",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  marginLeft: "4px",
};
