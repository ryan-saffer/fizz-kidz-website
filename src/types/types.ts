import type { GetImageResult } from "astro";
import React from "react";

export type CustomImage = {
  image: GetImageResult;
  alt: string;
};
