import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  components: {
    MuiTextField: {
        styleOverrides: {
            root: {
            "& .MuiOutlinedInput-root": {
                borderRadius: "12px", // Rounded-xl
                border: "1px solid white", // White outline
                color: "white",
                "& fieldset": {
                borderColor: "white",
                },
                "&:hover fieldset": {
                // borderColor: "gray",
                border: "2px solid white"
                },
                "&.Mui-focused fieldset": {
                borderColor: "white",
                boxShadow: "10px 10px 50px rgba(255, 255, 255, 0.7)",
                },
            },
            "& .MuiInputBase-input::placeholder": {
                color: "rgba(255, 255, 255, 0.7)",
            },
            },
        },
    },
  },
});

export default theme;
