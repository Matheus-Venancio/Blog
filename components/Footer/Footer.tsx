import React from "react";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import YouTubeIcon from "@mui/icons-material/YouTube";
import styles from "./Footer.module.css";

const Footer: React.FC = () => {
  return (
    <footer className={styles.container}>
      <div className={styles.address}>Rua José Paulino, 1244 - Sala 72</div>
      <div className={styles.contact}>
        Telefone: (19) 99681-3766 | Email:
        mblivre.campinas@gmail.com
      </div>
      <div className={styles["social-media"]}>
        <a
          href="https://instagram.com/mblcampinas"
          target="_blank"
          rel="noreferrer"
          className={styles.instagram}
        >
          <InstagramIcon
            style={{ fill: "white", width: "28px", height: "28px" }}
          />
        </a>
        <a
          href="https://www.facebook.com/MBLCampinas01"
          target="_blank"
          rel="noreferrer"
          className={styles.facebook}
        >
          <FacebookIcon
            style={{ fill: "white", width: "28px", height: "28px" }}
          />
        </a>
        <a
          href="https://twitter.com/MBLivrecampinas"
          target="_blank"
          rel="noreferrer"
        >
          <img src="/twitter.svg" alt="twitter logo" />
        </a>
        <a
          href="https://youtube.com/@mblcps"
          target="_blank"
          rel="noreferrer"
          className={styles.youtube}
        >
          <YouTubeIcon
            style={{ fill: "white", width: "28px", height: "28px" }}
          />
        </a>
        <a
          href="https://www.tiktok.com/@mblcampinas"
          target="_blank"
          className={styles.tiktok}
          rel="noreferrer"
        >
          <img src="/tiktok.svg" alt="TikTok" />
        </a>
      </div>
      <div className={styles.copyright}>
        &copy; 2023 MBL Campinas. Todos direitos reservados.
      </div>
    </footer>
  );
};

export default Footer;
