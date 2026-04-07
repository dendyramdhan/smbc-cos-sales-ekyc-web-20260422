import { redirect } from "next/navigation";
import { FC } from "react";

const Home: FC = () => {
  redirect("/ekyc");
  return null;
};

export default Home;
