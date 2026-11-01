
import NextTopLoader from "nextjs-toploader";

export default function NextJsTopLoader() {
  return (
    <NextTopLoader
      color="#00B047"
      initialPosition={0.08}
      crawlSpeed={200}
      height={3}
      crawl={true}
      showSpinner={true}
      easing="ease"
      speed={200}
      zIndex={1600}
    />
  );
}