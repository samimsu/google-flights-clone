import { Dispatch, SetStateAction, useState } from "react";
import {
  Autocomplete,
  Button,
  FormControl,
  Grid2 as Grid,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import axios from "axios";
import config from "../../utils/config";
import { useNavigate } from "react-router";

type AirportType = {
  presentation: { suggestionTitle: string };
  navigation: { relevantFlightParams: { skyId: string; entityId: string } };
};

const SearchForm = () => {
  const [tripType, setTripType] = useState<string>("round trip");
  const [people, setPeople] = useState<string>("1");
  const [classType, setClassType] = useState<string>("economy");
  const [fromAirport, setFromAirport] = useState<{
    skyId: string;
    entityId: string;
  } | null>(null);
  const [toAirport, setToAirport] = useState<{
    skyId: string;
    entityId: string;
  } | null>(null);
  const [departureDate, setDepartureDate] = useState<Date | null>(null);
  const [returnDate, setReturnDate] = useState<Date | null>(null);
  const [fromAirportResultsLoading, setFromAirportResultsLoading] =
    useState<boolean>(false);
  const [toAirportResultsLoading, setToAirportResultsLoading] =
    useState<boolean>(false);
  const [fromAirportResults, setFromAirportResults] = useState<[]>([]);
  const [toAirportResults, setToAirportResults] = useState<[]>([]);
  const [flightsLoading, setFlightsLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  const getAirportResults = async (
    query: string,
    setLoading: Dispatch<SetStateAction<boolean>>,
    setResults: Dispatch<SetStateAction<[]>>
  ) => {
    const controller = new AbortController();

    const options = {
      method: "GET",
      url: `${config.skyScrapperV1API}/flights/searchAirport`,
      params: {
        query: query,
      },
      headers: {
        "x-rapidapi-key": import.meta.env.VITE_RAPIDAPI_KEY,
        "x-rapidapi-host": "sky-scrapper.p.rapidapi.com",
      },
      signal: controller.signal,
    };

    try {
      setLoading(true);
      const response = await axios.request(options);
      const airports = response.data?.data?.filter(
        (item: { navigation: { entityType: string } }) =>
          item.navigation.entityType === "AIRPORT"
      );

      setResults(
        airports.map((airport: AirportType) => ({
          label: `${airport.presentation.suggestionTitle}`,
          skyId: airport.navigation.relevantFlightParams.skyId,
          entityId: airport.navigation.relevantFlightParams.entityId,
        }))
      );

      setLoading(false);
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Request canceled:", error.message);
      } else {
        console.error("Request failed:", error);
      }
    } finally {
      setLoading(false);
    }

    return controller;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const formData = {
      originSkyId: fromAirport?.skyId,
      destinationSkyId: toAirport?.skyId,
      originEntityId: fromAirport?.entityId,
      destinationEntityId: toAirport?.entityId,
      date: departureDate?.toISOString().slice(0, 10),
      returnDate: returnDate?.toISOString().slice(0, 10) || "",
      cabinClass: classType,
      adults: people,
      sortBy: "best",
    };

    console.log("Form submitted with data:", formData);

    const options = {
      method: "GET",
      url: `${config.skyScrapperV2API}/flights/searchFlights`,
      params: formData,
      headers: {
        "Content-Type": "application/json",
        "x-rapidapi-key": import.meta.env.VITE_RAPIDAPI_KEY,
        "x-rapidapi-host": "sky-scrapper.p.rapidapi.com",
      },
    };

    try {
      setFlightsLoading(true);
      const response = await axios.request(options);
      console.log(response.data);
      navigate("/search", { state: { flights: response.data } });
    } catch (error) {
      console.error("Request failed:", error);
    } finally {
      setFlightsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Paper
        sx={{ position: "relative", padding: "8px 16px 48px", elevation: 3 }}
      >
        <Stack direction="row" spacing={2} sx={{ marginBottom: "16px" }}>
          <FormControl>
            <Select
              labelId="trip-type"
              id="trip-type-select"
              value={tripType}
              label="Type"
              onChange={(e) => setTripType(e.target.value)}
              variant="standard"
              sx={{ width: "fit-content" }}
            >
              <MenuItem value="round trip">Round trip</MenuItem>
              <MenuItem value="one way">One way</MenuItem>
              <MenuItem value="multi-city">Multi-city</MenuItem>
            </Select>
          </FormControl>
          <FormControl>
            <Select
              labelId="people"
              id="people-select"
              value={people}
              label="People"
              onChange={(e) => setPeople(e.target.value)}
              variant="standard"
              sx={{ width: "fit-content" }}
            >
              <MenuItem value="1">1</MenuItem>
              <MenuItem value="2">2</MenuItem>
              <MenuItem value="3">3</MenuItem>
              <MenuItem value="4">4</MenuItem>
              <MenuItem value="5">5</MenuItem>
              <MenuItem value="6">6</MenuItem>
              <MenuItem value="7">7</MenuItem>
              <MenuItem value="8">8</MenuItem>
              <MenuItem value="9">9</MenuItem>
            </Select>
          </FormControl>
          <FormControl>
            <Select
              labelId="class"
              id="class-select"
              value={classType}
              label="Class"
              onChange={(e) => setClassType(e.target.value)}
              variant="standard"
              sx={{ width: "fit-content" }}
            >
              <MenuItem value="economy">Economy</MenuItem>
              <MenuItem value="premium economy">Premium economy</MenuItem>
              <MenuItem value="business">Business</MenuItem>
              <MenuItem value="first">First</MenuItem>
            </Select>
          </FormControl>
        </Stack>

        <Grid container spacing={2}>
          <Grid size={3}>
            <Autocomplete
              options={fromAirportResults}
              loading={fromAirportResultsLoading}
              onChange={(_, value) => setFromAirport(value)}
              onInputChange={(_, newValue) => {
                if (newValue) {
                  getAirportResults(
                    newValue,
                    setFromAirportResultsLoading,
                    setFromAirportResults
                  );
                }
              }}
              getOptionLabel={(option: any) => option.label || ""}
              renderInput={(params) => (
                <TextField {...params} type="text" placeholder="Where from?" />
              )}
            />
          </Grid>

          <Grid size={3}>
            <Autocomplete
              options={toAirportResults}
              loading={toAirportResultsLoading}
              onChange={(_, value) => setToAirport(value)}
              onInputChange={(_, newValue) => {
                if (newValue) {
                  getAirportResults(
                    newValue,
                    setToAirportResultsLoading,
                    setToAirportResults
                  );
                }
              }}
              // inputValue={toInput}
              getOptionLabel={(option: any) => option.label || ""}
              renderInput={(params) => (
                <TextField {...params} type="text" placeholder="Where to?" />
              )}
            />
          </Grid>

          <Grid size={3}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                value={departureDate}
                onChange={(newValue) => setDepartureDate(newValue)}
                sx={{ width: "100%" }}
                slotProps={{ textField: { placeholder: "Departure" } }}
              />
            </LocalizationProvider>
          </Grid>

          <Grid size={3}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                value={returnDate}
                onChange={(newValue) => setReturnDate(newValue)}
                sx={{ width: "100%" }}
                slotProps={{ textField: { placeholder: "Return" } }}
              />
            </LocalizationProvider>
          </Grid>
        </Grid>

        <Stack
          sx={{
            position: "absolute",
            left: 0,
            textAlign: "center",
            width: "100%",
            display: "block",
            bottom: "-24px",
          }}
        >
          <Button
            type="submit"
            variant="contained"
            loading={flightsLoading}
            startIcon={<SearchIcon />}
            sx={{
              borderRadius: "9999px",
              textTransform: "none",
              marginBottom: "5px",
            }}
          >
            Explore
          </Button>
        </Stack>
      </Paper>
    </form>
  );
};

export default SearchForm;
