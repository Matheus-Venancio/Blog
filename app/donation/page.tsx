import React from "react";
import styles from "./donation.module.css";

export default function Donation() {
  return (
    <div className={styles.container}>
      <h1 className="text-3xl">Olá, que bom que você quer ajudar!</h1>
      <div className={`${styles.infoContainer} text-lg`}>
        <p>
          Nós do MBL Campinas trabalhamos de forma voluntária, pois acreditamos
          que com esse trabalho conseguiremos construir um país melhor.
        </p>
        <p>
          O núcleo de Campinas ainda é pequeno, e precisamos de sua ajuda para
          fazê-lo crescer. Nossa principal meta neste ano de 2023 é conseguir
          arrecadar o suficiente para conseguirmos alugar um espaço físico no
          centro de Campinas.
        </p>
        <p>
          Por enquanto, a única forma de ajudar o núcleo financeiramente é
          através do PIX:
        </p>
      </div>
      <h2 className="text-2xl">PIX (email)</h2>
      <h1 className="text-2xl sm:text-3xl">pix.mblivre.campinas@gmail.com</h1>
    </div>
  );
}
