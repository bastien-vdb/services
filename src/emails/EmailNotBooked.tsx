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
  bookingStartTime: string;
}

const baseUrl = process.env.NEXT_PUBLIC_HOST
  ? `${process.env.NEXT_PUBLIC_HOST}`
  : "";

export const EmailRdvBooked = ({
  customerName,
  bookingStartTime,
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
      <Preview>Le rendez-vous n'a pas pu être pris en compte</Preview>
      <Body style={main}>
        <Container style={container}>
          <Img
            src={`${baseUrl}/vendorImages/fineststudiologo.png`}
            width={48}
            height={48}
            alt="FinestLashStudio"
          />
          <Heading style={heading}>
            🪄 Cher {customerName}, le rendez-vous, prévu pour le
            {bookingStartTime && dateString} à {bookingStartTime && heureString}
            , n'a pas pu être confirmé.
          </Heading>
          <Section style={body}>
            <Text style={paragraph}>
              Nous nous excusons pour la gêne occasionnée. Veuillez nous
              contacter pour plus d'informations.
            </Text>
            Finest lash Studio
          </Section>
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
        </Container>
      </Body>
    </Html>
  );
};

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
