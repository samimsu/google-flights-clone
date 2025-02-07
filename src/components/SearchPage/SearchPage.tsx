import { Stack, Typography } from "@mui/material";
import SearchForm from "./SearchForm";

const SearchPage = () => {
  return (
    <Stack style={{ maxWidth: "1024px", margin: "0 auto" }}>
      <Typography
        sx={{ margin: "0 auto 40px", textAlign: "center", fontSize: "56px" }}
      >
        Flights
      </Typography>
      <SearchForm />
    </Stack>
  );
};

export default SearchPage;
