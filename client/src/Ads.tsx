import { Box } from "@chakra-ui/react";
import { FC } from "react";

const Ads: FC = () => {

  return (
    <Box>
      <script async data-adbreak-test="on" src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>

      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-5045724371380166"
        data-ad-slot="4562495028"
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>

      <script>
        (adsbygoogle = window.adsbygoogle || []).push({});
      </script>
    </Box>
  );
}

export default Ads;
