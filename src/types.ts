export interface InputFile {
  logo: string;
  supplementImage: string;
  header: string;
  icons: Icon[];
  defaultMinimumPerCategory: number;
  categories: Category[];
  rules: string[];
  entries: Entry[];
}

export interface Icon {
  name: string;
  image: string;
}

export interface Category {
  name: string;
}

interface Entry {
  description: string;
  category: string;
  icon?: string;
}

export type EntryWithId = Entry & { id: number };
