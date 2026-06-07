export interface FooterSection {
  title: string;
  links: {
    label: string;
    href: string;
  }[];
}

export interface FooterColumn {
  sections: FooterSection[];
}
