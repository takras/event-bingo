export interface InputFile {
  logo: string;
  supplementImage: string;
  header: string;
  icons: Icon[];
  defaultMinimumPerCategory: number;
  categories: Category[];
  rules: string[];
  entries: Entry[];
  name?: string;
  version?: number;
  isBigBoard: boolean;
}

export interface Icon {
  name: string;
  image: string;
}

export interface Category {
  name: string;
}

export interface Entry {
  description: string;
  category: string;
  icon?: string;
}

export type EntryWithId = Entry & { id: number };
