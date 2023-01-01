import { Link } from "react-router-dom";

// @mui icons
import DoDisturbIcon from "@mui/icons-material/DoDisturb";

// @mui components
import { Box, Button, Typography } from "@mui/material";

// @emotion/css
import { css } from "@emotion/css";

// contexts
import { useLanguage } from "../../context/LanguageProvider";

const NotFound = () => {
  const { languageState } = useLanguage();
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        width: { xs: "80%" },
        maxWidth: "600px",
        margin: "auto",
        textAlign: "center",
        marginTop: "150px",
      }}
    >
      <DoDisturbIcon color="secondary" sx={{ fontSize: "4rem" }} />
      <Typography color="secondary" variant="h4" sx={{ marginTop: "20px" }}>
        {languageState.texts.NotFound.Title}
      </Typography>
      <Typography
        color="secondary"
        variant="body1"
        sx={{ marginTop: "20px", width: "80vw" }}
      >
        {languageState.texts.NotFound.Description}
      </Typography>
      <Link
        to="/"
        className={css({ textDecoration: "none", marginTop: "20px" })}
      >
        <Button variant="contained">{languageState.texts.NotFound.Link}</Button>
      </Link>
    </Box>
  );
};

export default NotFound;
