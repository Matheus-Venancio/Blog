import React, { Suspense } from "react";
import { Button } from "@nextui-org/react";
import Lead from "@/components/LandingPage/Lead/Lead";
import Link from "next/link";
import PostsSectionSkeleton from "@/components/postsSection/postsSectionSkeleton";
import PostsSection from "@/components/postsSection/postsSection";
import styles from "./page.module.css";

export const revalidate = 1800; // revalidate at most every 30 minutes

export default function Home() {
  return (
    <div className={styles.container}>
      <Lead />
      <main className={styles.mainContainer}>
        <Suspense fallback={<PostsSectionSkeleton />}>
          <PostsSection />
        </Suspense>
        <div className="flex justify-center my-5">
          <Link href="/blog">
            <Button className="w-[200px]" color="primary">
              Ver mais
            </Button>
          </Link>
        </div>
        <h2 className="text-2xl mb-3">Eventos</h2>
        <Suspense fallback={<PostsSectionSkeleton />}>
          <PostsSection isEvent />
        </Suspense>
        <section className={styles.reportsContainer}>
          <img
            className="w-full h-auto"
            src="/reports.png"
            alt="Denuncie!"
            loading="lazy"
          />
          <div className={styles.reportsDescription}>
            <h2 className="mb-4 text-xl">Problemas na sua região?</h2>
            <p>
              O MBL Campinas está aqui para te ajudar! Veja agora como denunciar
              os problemas de infraestrutura da sua região para nosso time, e
              nós cuidaremos da parte burocrática para resolver seus problemas!
            </p>
            <Link href="/reports">
              <Button className="mt-4" color="primary">
                Denunciar agora
              </Button>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
