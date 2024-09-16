"use client";

import React from "react";
import styles from "./Lead.module.css";
import Link from "next/link";
import { Button, Card, CardBody, Image } from "@nextui-org/react";
import { Typography, useMediaQuery, useTheme } from "@mui/material";
import { ChevronRight, VolunteerActivism } from "@mui/icons-material";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const carouselImgSrcs = [
  "/cesta_basica_colagem.webp",
  "/missao_pessoas.jpg",
  "/esquina_boa_22-07.jpeg",
];

export default function Lead() {
  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.down("md"));
  function handleNewSupporter() {
    if (window) {
      window
        .open(
          "https://docs.google.com/forms/d/e/1FAIpQLSdmMhyk2HLNA_IiAuLHQ_vn6mCpM1X_VrFpWM2ZVYlb8fBwUA/viewform?pli=1",
          "_blank"
        )
        ?.focus();
    }
  }

  return (
    <section
      className={`${styles.lead} h-[1000px] md:h-[1100px] lg:h-[110vh] relative`}
    >
      {/* <div className="px-5 md:ml-28 mt-20 md:mt-40 md:pr-28 w-full md:w-11/12 flex flex-col md:flex-row justify-between items-center"> */}
      <div className="mt-20 sm:mt-32 lg:mt-52 px-5 md:px-10 flex flex-col lg:flex-row m-auto">
        <div className="md:mr-5">
          <Typography variant="h3" color="white" className="max-w-md">
            &ldquo;Seja a mudança que você quer ver no mundo&rdquo;
          </Typography>
          <Button
            color="warning"
            onPress={handleNewSupporter}
            endContent={<ChevronRight />}
            className="mt-5 h-14 text-xl font-bold block"
          >
            Seja um de nós
          </Button>
          <Link href="/donation">
            <Button
              className="mt-5 h-14 text-xl font-bold text-black"
              color="secondary"
              endContent={<VolunteerActivism />}
            >
              Apoie nosso trabalho
            </Button>
          </Link>
        </div>
        {/* <Carousel className="w-[320px] md:w-[640px] m-auto md:mr-14 mt-16 md:mt-0"> */}
        <Carousel
          opts={{
            loop: true,
          }}
          className="mt-10 lg:mt-0 mx-auto lg:mr-9 max-w-[640px] w-full md:w-[640px]"
        >
          <CarouselContent>
            {carouselImgSrcs.map((imgSrc, index) => (
              <CarouselItem key={index}>
                <Card>
                  <CardBody className="overflow-visible py-2">
                    <Image
                      alt="Card background"
                      className="object-cover rounded-xl max-h-[300px] md:max-h-none md:h-[345px]"
                      src={imgSrc}
                      width={640}
                      height={320}
                    />
                  </CardBody>
                </Card>
                {/* <div className="p-1">
              <Card>
                <CardContent className="flex aspect-square items-center justify-center p-6">
                  <span className="text-4xl font-semibold">{index + 1}</span>
                </CardContent>
              </Card>
            </div> */}
              </CarouselItem>
            ))}
          </CarouselContent>
          {!isMd && (
            <>
              <CarouselPrevious />
              <CarouselNext />
            </>
          )}
        </Carousel>
      </div>
    </section>
  );
}
