import { useLocation } from "react-router";
import { format, parseISO } from "date-fns";
import { Box, Divider, Grid2 as Grid, Stack, Typography } from "@mui/material";

const FlightCard = ({ flight }: any) => {
  console.log("flight", flight);

  const formatTimeToLocal = (isoDateString: string): string => {
    const date = parseISO(isoDateString); // Parse the string into a Date object
    return format(date, "p"); // 'p' is for localized time format
  };

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    const hoursText = hours > 0 ? `${hours} hr` : "";
    const minutesText = remainingMinutes > 0 ? `${remainingMinutes} min` : "";

    return [hoursText, minutesText].filter(Boolean).join(" ");
  };

  const firstFlight = flight.legs[0];

  const departureTime = formatTimeToLocal(firstFlight.departure);
  const arrivalTime = formatTimeToLocal(firstFlight.arrival);

  return (
    <Grid container spacing={2}>
      <Grid size={1}>
        <img
          src={firstFlight.carriers.marketing[0].logoUrl}
          alt="carrier logo"
        />
      </Grid>
      <Grid size={4}>
        <Typography>
          {departureTime} - {arrivalTime}
        </Typography>
        <Typography sx={{ fontSize: "0.75rem", color: "grey.600" }}>
          {firstFlight.carriers.marketing[0].name}
        </Typography>
      </Grid>
      <Grid size={2}>
        <Typography>{formatDuration(firstFlight.durationInMinutes)}</Typography>
        <Typography sx={{ fontSize: "0.75rem", color: "grey.600" }}>
          {firstFlight.origin.displayCode} -{" "}
          {firstFlight.destination.displayCode}
        </Typography>
      </Grid>
      <Grid size={4}>
        <Typography>
          {firstFlight.stopCount
            ? `${firstFlight.stopCount} ${
                firstFlight.stopCount === 1 ? "stop" : "stops"
              }`
            : "Nonstop"}
        </Typography>
      </Grid>
      <Grid size={1}>
        <Typography>{flight.price.formatted}</Typography>
      </Grid>
    </Grid>
  );
};

const SearchResultsPage = () => {
  const location = useLocation();
  const flights = location.state?.flights || [];

  return (
    <Stack>
      <Typography variant="h5" gutterBottom>
        Departing Flights
      </Typography>
      <Box
        border={1}
        padding={2}
        sx={{ borderColor: "grey.300", borderRadius: "16px" }}
      >
        <Stack spacing={2}>
          {flights.data.itineraries.map((flight: any, index: number) => (
            <>
              <FlightCard key={index} flight={flight} />
              <Divider />
            </>
          ))}
        </Stack>
      </Box>
    </Stack>
  );
};

export default SearchResultsPage;
