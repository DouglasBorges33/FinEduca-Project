export interface Theme {
  name: string;
  id: string;
  colors: {
    '--color-primary': string;
    '--color-primary-light': string;
    '--color-primary-dark': string;
    '--color-primary-super-light': string;

    '--color-accent': string;
    '--color-accent-light': string;
  };
}

export const THEMES: Theme[] = [
  {
    name: 'Vibrante',
    id: 'vibrant',
    colors: {
      '--color-primary': '217 70 239',
      '--color-primary-light': '240 171 252',
      '--color-primary-dark': '192 38 211',
      '--color-primary-super-light': '245 208 254',
      '--color-accent': '163 230 53',
      '--color-accent-light': '190 242 100',
    }
  },
  {
    name: 'Esmeralda',
    id: 'emerald',
    colors: {
      '--color-primary': '16 185 129',
      '--color-primary-light': '52 211 153',
      '--color-primary-dark': '5 150 105',
      '--color-primary-super-light': '209 250 229',
      '--color-accent': '6 182 212',
      '--color-accent-light': '34 211 238',
    }
  },
  {
    name: 'Céu',
    id: 'sky',
    colors: {
      '--color-primary': '14 165 233',
      '--color-primary-light': '56 189 248',
      '--color-primary-dark': '2 132 199',
      '--color-primary-super-light': '224 242 254',
      '--color-accent': '244 63 94',
      '--color-accent-light': '251 113 133',
    }
  },
  {
    name: 'Índigo',
    id: 'indigo',
    colors: {
      '--color-primary': '99 102 241',
      '--color-primary-light': '129 140 248',
      '--color-primary-dark': '79 70 229',
      '--color-primary-super-light': '224 231 255',
      '--color-accent': '245 158 11',
      '--color-accent-light': '251 191 36',
    }
  },
  {
    name: 'Rosa',
    id: 'rose',
    colors: {
      '--color-primary': '244 63 94',
      '--color-primary-light': '251 113 133',
      '--color-primary-dark': '225 29 72',
      '--color-primary-super-light': '255 228 230',
      '--color-accent': '20 184 166',
      '--color-accent-light': '45 212 191',
    }
  },
  {
    name: 'Violeta',
    id: 'violet',
    colors: {
      '--color-primary': '139 92 246',
      '--color-primary-light': '167 139 250',
      '--color-primary-dark': '124 58 237',
      '--color-primary-super-light': '237 233 254',
      '--color-accent': '236 72 153',
      '--color-accent-light': '244 114 182',
    }
  }
];