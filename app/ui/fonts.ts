import {
  Arizonia,
  Bricolage_Grotesque,
  Climate_Crisis,
  Manrope,
} from "next/font/google";

export const arizonia = Arizonia({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export const climateCrisis = Climate_Crisis({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-climate",
  display: "swap",
});

export const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
});

export const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});
