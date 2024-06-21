import React, { ReactNode } from "react";
import styles from "./styled.module.css";

export const Container = ({ children }: { children: ReactNode }) => (
  <div className={styles.container}>{children}</div>
);
export const ItemContainer = ({ children }: { children: ReactNode }) => (
  <div className={styles.itemContainer}>{children}</div>
);
export const StyledIconWrapper = ({ children }: { children: ReactNode }) => (
  <div className={styles.buttonRound}>{children}</div>
);
export const StyledWrapper = ({ children }: { children: ReactNode }) => (
  <div className={styles.wrapper}>{children}</div>
);
export const Flex = ({ children }: { children: ReactNode }) => (
  <div className={styles.flex}>{children}</div>
);
export const FixedToBottom = ({ children }: { children: ReactNode }) => (
  <div className={styles.fixedToBottom}>{children}</div>
);
export const Label = ({ children }: { children: ReactNode }) => (
  <span className={styles.label}>{children}</span>
);
export const ScrollableSmall = ({ children }: { children: ReactNode }) => (
  <span className={styles.scroll}>{children}</span>
);
export const FullScreen = ({ children }: { children: ReactNode }) => (
  <span className={styles.fullScreen}>{children}</span>
);
export const HideOnMobile = ({ children }: { children: ReactNode }) => (
  <span className={styles.hideOnMobile}>{children}</span>
);
