"use client";

import React from "react";
import { Info } from "@mui/icons-material";
import ReportsForm from "@/components/ReportsForm/ReportsForm";
import styles from "./reports.module.css";
import { Accordion, AccordionItem } from "@nextui-org/react";

export default function Reports() {
  return (
    <div className={`${styles.container} text-xl`}>
      <section className="flex-1 mb-10 md:max-w-lg sm:mr-12 sm:mb-0">
        <h1 className="text-4xl mb-5">Canal de denúncias</h1>
        <div className="flex items-center sm:items-start">
          <Info fontSize="medium" color="success" />
          <h4 className="ml-2">Como fazer uma boa denúncia?</h4>
        </div>
        <Accordion fullWidth>
          <AccordionItem
            key="1"
            className="text-lg"
            aria-label="Accordion 1"
            title="Título"
          >
            O Título deve resumir o problema que será denunciado.
          </AccordionItem>
          <AccordionItem
            key="2"
            className="text-lg"
            aria-label="Accordion 2"
            title="Local"
          >
            O Local deve ser o mais preciso possível. De preferência, no
            formato: &lt;Nome da rua&gt;, &lt;Número&gt;. &lt;Nome da
            cidade&gt; - &lt;Sigla do estado (UF) &gt;, &lt;CEP&gt;
          </AccordionItem>
          <AccordionItem
            key="3"
            className="text-lg"
            aria-label="Accordion 2"
            title="Telefone - Opcional"
          >
            Pode ser que você não consiga fornecer um Local preciso, mas consiga
            nos guiar até lá. Ou talvez você queira acompanhar o andamento de
            sua denúncia. Para isso, você pode fornecer um telefone de contato,
            de preferência um telefone com WhatsApp.
          </AccordionItem>
          <AccordionItem
            key="4"
            className="text-lg"
            aria-label="Accordion 2"
            title="Descrição"
          >
            A Descrição deve enunciar qual é o problema e trazer mais detalhes
            (quanto mais detalhes, melhor!) Tente responder essas perguntas na
            descrição:
            <ol>
              <li>1. Há quanto tempo o problema está vigente?</li>
              <li>
                2. Quais são as implicações ou os perigos associados a esse
                problema?
              </li>
              <li>
                3. Como o problema afeta os moradores ou os indivíduos que
                passam pela região?
              </li>
            </ol>
          </AccordionItem>
          <AccordionItem
            key="5"
            className="text-lg"
            aria-label="Accordion 3"
            title="Imagens"
          >
            Sempre que possível, use a seção de Imagens para adicionar imagens
            ou vídeos que mostrem o problema. (os vídeos poderão ser publicados
            nas redes sociais para maior pressão social).
          </AccordionItem>
        </Accordion>
      </section>
      <section className={styles.formContainer}>
        <h1 className="text-3xl mb-3">Denúncia</h1>
        <ReportsForm />
      </section>
    </div>
  );
}
